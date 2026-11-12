// ---------------------------------------------------------------------------
// routeFinder.js
// All the "thinking" for Veyora's transport search lives here, away from the UI.
//
// HOW TIME IS HANDLED (the key idea)
// ----------------------------------
// A clock time like "23:30" has no idea which day it is. That causes bugs when a
// journey crosses midnight. So instead of clock times we use ABSOLUTE MINUTES:
//
//     minutes counted from 00:00 on the travel date
//
//     00:00 on the travel date   ->     0
//     18:00 on the travel date   ->  1080
//     23:30 on the travel date   ->  1410
//     00:30 the NEXT day         ->  1470   (1440 minutes in a day + 30)
//     06:00 the NEXT day         ->  1800
//
// With one number line, "later" is always a bigger number, so waiting time is
// just a subtraction and a next-day arrival is simply a number above 1440.
// To show it to the user we convert back: minutes % 1440 gives the clock time
// and Math.floor(minutes / 1440) gives how many days after the travel date.
// ---------------------------------------------------------------------------

export const MINUTES_PER_DAY = 1440;

// Vehicles that run on demand. We only suggest them when the data says the
// route and availability information is reliable (reliableAvailability: true).
export const ON_DEMAND_TYPES = ["Taxi", "Car", "Share Auto"];

// Rules for the search. Change a number here and the whole search follows it.
export const SEARCH_RULES = {
  maxLegs: 3, // a journey may use at most 3 vehicles
  minTransferMinutes: 15, // need at least 15 min to change vehicles
  maxTransferWaitMinutes: 180, // never wait more than 3 hours at a transfer
  maxInitialWaitMinutes: 360, // first vehicle must leave within 6 hours of the chosen time
  durationWeight: 0.5, // how much journey time matters when ranking routes
  fareWeight: 0.5, // how much fare matters when ranking routes
};

// ----------------------------- Time helpers --------------------------------

// "21:30" -> 1290 (minutes after midnight)
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// 1470 -> "00:30" (drops the day part and shows the clock time)
export const formatClock = (minutes) => {
  const clockMinutes = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(clockMinutes / 60);
  const mins = clockMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// 570 -> "9h 30m"
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

// How many days after the travel date does this moment fall? (0 = same day)
export const getDayOffset = (minutes) => Math.floor(minutes / MINUTES_PER_DAY);

// "2026-11-10" + 1 day -> "11 Nov 2026"
export const formatDate = (dateString, dayOffset = 0) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + dayOffset));

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

// ---------------------------- Location helpers -----------------------------

// Makes "  tirunelveli  " and "Tirunelveli" count as the same place
export const normalizeLocation = (name) => name.trim().replace(/\s+/g, " ").toLowerCase();

// Every distinct place name that appears in the data, sorted A to Z
export const getKnownLocations = (data) => {
  const names = new Set();

  data.forEach((option) => {
    names.add(option.from);
    names.add(option.to);
  });

  return [...names].sort();
};

// ---------------------------- Transport helpers ----------------------------

// Taxi / Car / Share Auto are only suggested when the data marks them reliable.
// Buses and trains follow a timetable, so they are always allowed.
export const isSuggestable = (option) =>
  !ON_DEMAND_TYPES.includes(option.type) || option.reliableAvailability === true;

// Journey length in minutes. If arrival is earlier on the clock than departure,
// the vehicle crossed midnight, so we add one day:  21:00 -> 06:00 = 9 hours.
export const getDuration = (option) => {
  const departure = timeToMinutes(option.startTime);
  const arrival = timeToMinutes(option.endTime);

  return (arrival - departure + MINUTES_PER_DAY) % MINUTES_PER_DAY;
};

// Finds the first time this vehicle leaves that is NOT before `earliestTime`.
// The same vehicle runs every day, so if today's departure has gone we use
// tomorrow's (add 1440 minutes), and so on.
export const getNextDeparture = (option, earliestTime) => {
  const departure = timeToMinutes(option.startTime);

  if (departure >= earliestTime) return departure;

  const daysToAdd = Math.ceil((earliestTime - departure) / MINUTES_PER_DAY);
  return departure + daysToAdd * MINUTES_PER_DAY;
};

// One "leg" = one vehicle ride with real (absolute) departure and arrival times.
// waitBefore = how long the traveller waits before this ride leaves.
const buildLeg = (option, earliestTime, readyTime) => {
  const departure = getNextDeparture(option, earliestTime);

  return {
    option,
    departure,
    arrival: departure + getDuration(option),
    duration: getDuration(option),
    waitBefore: departure - readyTime,
  };
};

// Joins the legs of one journey and works out the totals
const buildRoute = (legs) => {
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  return {
    legs,
    totalFare: legs.reduce((sum, leg) => sum + Number(leg.option.fare), 0),
    // from the first departure to the final arrival (includes waiting at transfers)
    totalDuration: lastLeg.arrival - firstLeg.departure,
    // waiting at transfer points only (not the wait before the first vehicle)
    totalWaiting: legs.slice(1).reduce((sum, leg) => sum + leg.waitBefore, 0),
    initialWait: firstLeg.waitBefore,
    transfers: legs.length - 1,
    departure: firstLeg.departure,
    arrival: lastLeg.arrival,
  };
};

// ------------------------------ Feature 1 ----------------------------------
// DIRECT TRANSPORT: one vehicle from the starting point to the destination.
export const findDirectOptions = (data, from, to, travelTime) => {
  const searchTime = timeToMinutes(travelTime);
  const fromKey = normalizeLocation(from);
  const toKey = normalizeLocation(to);

  return data
    .filter(
      (option) =>
        normalizeLocation(option.from) === fromKey &&
        normalizeLocation(option.to) === toKey &&
        isSuggestable(option)
    )
    .map((option) => buildLeg(option, searchTime, searchTime))
    .filter((leg) => leg.waitBefore <= SEARCH_RULES.maxInitialWaitMinutes)
    .sort((a, b) => a.departure - b.departure);
};

// ------------------------------ Feature 2 ----------------------------------
// ALTERNATIVE ROUTES using Breadth-First Search (BFS).
//
// BFS in plain words
// ------------------
// Imagine you are at the starting city. You first look at every place you can
// reach with ONE vehicle. Then, from each of those places, every place you can
// reach with a SECOND vehicle. Then a third. You explore the map in rings
// (1 vehicle, then 2, then 3), never going deeper until the current ring is done.
//
// To do that we keep a QUEUE (a waiting line) of "journeys so far":
//   1. Take the first journey from the front of the queue.
//   2. Look at every vehicle leaving from where that journey currently ends.
//   3. Check each vehicle with the rules below. If it passes:
//        - if it reaches the destination -> save it as a finished route
//        - otherwise -> add the longer journey to the BACK of the queue
//   4. Repeat until the queue is empty.
//
// Rules every vehicle must pass (this is how we avoid invalid routes)
//   - No circular routes: we remember every place the journey has already
//     visited and never go back to one (A -> B -> A is blocked).
//   - Real timing: the vehicle's departure must be at least 15 minutes after the
//     previous vehicle ARRIVED (a real transfer time, not just clock times).
//   - Waiting limit: wait at most 3 hours at a transfer.
//   - Length limit: at most 3 vehicles in total.
//   - Only suggest taxi/car/share-auto when marked reliable.
//
// This is only called when there is NO direct transport, so a one-vehicle trip
// is never listed here.
export const findAlternativeRoutes = (data, from, to, travelTime) => {
  const searchTime = timeToMinutes(travelTime);
  const fromKey = normalizeLocation(from);
  const toKey = normalizeLocation(to);
  const { maxLegs, minTransferMinutes, maxTransferWaitMinutes, maxInitialWaitMinutes } =
    SEARCH_RULES;

  const foundRoutes = [];

  // Each queue item: where we are, the legs used so far, places already visited,
  // and the moment we are ready to board the next vehicle.
  const queue = [
    {
      locationKey: fromKey,
      legs: [],
      visited: new Set([fromKey]),
      readyTime: searchTime,
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift(); // take from the FRONT of the line

    if (current.legs.length >= maxLegs) continue;

    const isFirstLeg = current.legs.length === 0;

    data.forEach((option) => {
      if (normalizeLocation(option.from) !== current.locationKey) return;
      if (!isSuggestable(option)) return;

      const nextKey = normalizeLocation(option.to);

      // Circular route check: never return to a place we already visited
      if (current.visited.has(nextKey)) return;

      // The earliest we can board: the chosen time for the first vehicle,
      // or the previous arrival plus the minimum transfer time.
      const earliestBoarding = isFirstLeg
        ? searchTime
        : current.readyTime + minTransferMinutes;

      const leg = buildLeg(option, earliestBoarding, current.readyTime);

      // Waiting-time check
      const waitLimit = isFirstLeg ? maxInitialWaitMinutes : maxTransferWaitMinutes;
      if (leg.waitBefore > waitLimit) return;

      const newLegs = [...current.legs, leg];

      if (nextKey === toKey) {
        // Destination reached. Save it (needs at least 2 vehicles).
        if (newLegs.length >= 2) foundRoutes.push(buildRoute(newLegs));
        return;
      }

      // Not there yet: add the longer journey to the BACK of the line
      queue.push({
        locationKey: nextKey,
        legs: newLegs,
        visited: new Set([...current.visited, nextKey]),
        readyTime: leg.arrival,
      });
    });
  }

  return rankRoutes(foundRoutes);
};

// ------------------------------ Ranking ------------------------------------
// Ranks routes using BOTH journey time and fare (lower score = better).
//
// A fare of 600 and a time of 300 minutes cannot be added directly (different
// units), so each is first turned into a 0-to-1 number:
//     0 = the best (lowest) among the found routes
//     1 = the worst (highest) among the found routes
// Then   score = 0.5 x time score + 0.5 x fare score   (weights in SEARCH_RULES).
// If two routes tie, the one with fewer transfers wins, then shorter time.
export const rankRoutes = (routes) => {
  if (routes.length === 0) return routes;

  const { durationWeight, fareWeight } = SEARCH_RULES;

  const durations = routes.map((route) => route.totalDuration);
  const fares = routes.map((route) => route.totalFare);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);
  const minFare = Math.min(...fares);
  const maxFare = Math.max(...fares);

  const toScore = (value, min, max) => (max === min ? 0 : (value - min) / (max - min));

  return routes
    .map((route) => ({
      ...route,
      score:
        durationWeight * toScore(route.totalDuration, minDuration, maxDuration) +
        fareWeight * toScore(route.totalFare, minFare, maxFare),
    }))
    .sort(
      (a, b) =>
        a.score - b.score ||
        a.transfers - b.transfers ||
        a.totalDuration - b.totalDuration ||
        a.totalFare - b.totalFare
    );
};

// --------------------- Helpers for the user interface ----------------------
// These functions do NOT search or rank anything. They only take results that
// were already found and prepare friendly labels and explanations for the screen.

// A transfer shorter than this gets a "short transfer" reminder on screen.
export const SHORT_TRANSFER_MINUTES = 30;

// Today's date (or today + offsetDays) as "YYYY-MM-DD", the format a date input uses.
// Built from the local date parts so it never slips a day because of time zones.
export const getLocalDateString = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

// Every place on a route in order, including the stops where you change vehicles:
// ["Tirunelveli", "Kovilpatti", "Madurai"]
export const getRoutePlaces = (route) => [
  route.legs[0].option.from,
  ...route.legs.map((leg) => leg.option.to),
];

// Minutes spent actually travelling (without waiting at transfers)
export const getTotalRidingTime = (route) =>
  route.legs.reduce((sum, leg) => sum + leg.duration, 0);

// True when the list has at least two different values. A label such as
// "Cheapest" is only meaningful if the options really differ.
const hasDifferentValues = (values) => new Set(values).size > 1;

// Small labels for direct options: "Earliest", "Fastest", "Cheapest".
// Returns one list of labels per option, in the same order as `legs`.
export const getDirectHighlights = (legs) => {
  const departures = legs.map((leg) => leg.departure);
  const durations = legs.map((leg) => leg.duration);
  const fares = legs.map((leg) => Number(leg.option.fare));

  return legs.map((leg) => {
    const labels = [];

    if (hasDifferentValues(departures) && leg.departure === Math.min(...departures)) {
      labels.push("Earliest");
    }
    if (hasDifferentValues(durations) && leg.duration === Math.min(...durations)) {
      labels.push("Fastest");
    }
    if (
      hasDifferentValues(fares) &&
      Number(leg.option.fare) === Math.min(...fares)
    ) {
      labels.push("Cheapest");
    }

    return labels;
  });
};

// "Rs 100 more and 1h longer than route 1"
const describeDifference = (route, bestRoute) => {
  const fareGap = route.totalFare - bestRoute.totalFare;
  const timeGap = route.totalDuration - bestRoute.totalDuration;
  const parts = [];

  if (fareGap !== 0) parts.push(`₹${Math.abs(fareGap)} ${fareGap > 0 ? "more" : "less"}`);
  if (timeGap !== 0) {
    parts.push(`${formatDuration(Math.abs(timeGap))} ${timeGap > 0 ? "longer" : "shorter"}`);
  }

  return parts.length > 0
    ? `Compared with route 1: ${parts.join(" and ")}.`
    : "Same fare and journey time as route 1.";
};

// Labels and "why is this route suggested?" sentences for every alternative route.
// `routes` must already be ranked (best first), as findAlternativeRoutes returns them.
// Returns one { badges, reasons } object per route, in the same order.
export const getRouteHighlights = (routes) => {
  const { durationWeight, fareWeight, minTransferMinutes, maxTransferWaitMinutes } =
    SEARCH_RULES;
  const percent = (weight) => `${Math.round(weight * 100)}%`;

  const fares = routes.map((route) => route.totalFare);
  const durations = routes.map((route) => route.totalDuration);
  const transferCounts = routes.map((route) => route.transfers);
  const waits = routes.map((route) => route.totalWaiting);

  return routes.map((route, index) => {
    const badges = [];
    const reasons = [];

    if (routes.length > 1 && index === 0) badges.push("Best balance");

    // 1) Where this route sits in the ranking
    if (routes.length === 1) {
      reasons.push("This is the only valid connecting route found.");
    } else {
      reasons.push(
        `Ranked #${index + 1} of ${routes.length}, scored on journey time (${percent(
          durationWeight
        )}) and fare (${percent(fareWeight)}).`
      );
    }

    // 2) What it is best at, if anything
    if (hasDifferentValues(fares) && route.totalFare === Math.min(...fares)) {
      badges.push("Cheapest");
      reasons.push(`Lowest fare of all ${routes.length} routes (₹${route.totalFare}).`);
    }
    if (hasDifferentValues(durations) && route.totalDuration === Math.min(...durations)) {
      badges.push("Fastest");
      reasons.push(
        `Shortest journey time of all routes (${formatDuration(route.totalDuration)}).`
      );
    }
    if (hasDifferentValues(transferCounts) && route.transfers === Math.min(...transferCounts)) {
      badges.push("Fewest transfers");
      reasons.push(`Fewest vehicle changes (${route.transfers}).`);
    }
    if (hasDifferentValues(waits) && route.totalWaiting === Math.min(...waits)) {
      badges.push("Least waiting");
      reasons.push(`Shortest waiting time at transfers (${formatDuration(route.totalWaiting)}).`);
    }

    // 3) How it compares with the best-ranked route
    if (index > 0) reasons.push(describeDifference(route, routes[0]));

    // 4) The checks every route has passed
    reasons.push(
      `Every transfer is checked: at least ${minTransferMinutes} min to change vehicles and no more than ${formatDuration(
        maxTransferWaitMinutes
      )} of waiting.`
    );

    if (route.legs.some((leg) => ON_DEMAND_TYPES.includes(leg.option.type))) {
      reasons.push(
        "Includes a taxi or car because its sample availability is marked reliable."
      );
    }

    return { badges, reasons };
  });
};

// ------------------------- One call for the page ---------------------------
// Direct options first. Alternatives are searched ONLY when there is no direct
// option. `unknownLocations` lists any typed place that is not in the data.
export const searchTransport = (data, from, to, travelTime) => {
  const knownKeys = getKnownLocations(data).map(normalizeLocation);
  const unknownLocations = [from, to].filter(
    (place) => !knownKeys.includes(normalizeLocation(place))
  );

  const directOptions = findDirectOptions(data, from, to, travelTime);
  const alternativeRoutes =
    directOptions.length === 0 ? findAlternativeRoutes(data, from, to, travelTime) : [];

  return { directOptions, alternativeRoutes, unknownLocations };
};
