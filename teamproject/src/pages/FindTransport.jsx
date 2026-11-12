
import { useState } from "react";
import transportData from "../data/transportData";

const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Checks whether the selected time falls within the transport's time window
const isTimeAvailable = (item, travelTime) => {
  const userTime = toMinutes(travelTime);
  const start = toMinutes(item.startTime);
  const end = toMinutes(item.endTime);

  if (start <= end) {
    return userTime >= start && userTime <= end;
  }

  // Handles journeys that continue after midnight
  return userTime >= start || userTime <= end;
};

// Calculates the journey duration in minutes
const getDuration = (item) => {
  const start = toMinutes(item.startTime);
  const end = toMinutes(item.endTime);

  return end >= start ? end - start : end + 1440 - start;
};

// Finds alternative routes using Breadth-First Search
const findAlternativeRoutes = (from, to, travelTime) => {
  const userTime = toMinutes(travelTime);

  const queue = [];
  const alternativeRoutes = [];

  const maxLegs = 3;
  const minTransferTime = 15;
  const maxWaitingTime = 180;

  // Start the search from the user's selected location
  queue.push({
    currentLocation: from,
    path: [],
    visited: new Set([from.toLowerCase()]),
    arrivalTime: userTime,
  });

  while (queue.length > 0) {
    const current = queue.shift();

    // Stop searching if the route has reached the maximum number of legs
    if (current.path.length >= maxLegs) {
      continue;
    }

    const connections = transportData.filter(
      (item) =>
        item.from.toLowerCase() ===
        current.currentLocation.toLowerCase()
    );

    for (const item of connections) {
      const nextLocation = item.to;
      const nextLocationKey = nextLocation.toLowerCase();

      // Avoid visiting the same location again
      if (current.visited.has(nextLocationKey)) {
        continue;
      }

      let departureTime;

      if (current.path.length === 0) {
        // First transport must match the user's selected time
        if (!isTimeAvailable(item, travelTime)) {
          continue;
        }

        departureTime = current.arrivalTime;

        const start = toMinutes(item.startTime);
        const end = toMinutes(item.endTime);

        // Adjust the arrival time for overnight journeys
        let arrivalTime = end;

        if (start > end && userTime > end) {
          arrivalTime += 1440;
        }

        const newPath = [...current.path, item];

        // Destination reached
        if (nextLocationKey === to.toLowerCase()) {
          continue;
        }

        const newVisited = new Set(current.visited);
        newVisited.add(nextLocationKey);

        queue.push({
          currentLocation: nextLocation,
          path: newPath,
          visited: newVisited,
          arrivalTime,
        });

        continue;
      }

      // Find the next available departure after reaching the current location
      departureTime = toMinutes(item.startTime);

      while (
        departureTime <
        current.arrivalTime + minTransferTime
      ) {
        departureTime += 1440;
      }

      const waitingTime = departureTime - current.arrivalTime;

      // Do not allow transfers with more than 3 hours of waiting
      if (waitingTime > maxWaitingTime) {
        continue;
      }

      const arrivalTime = departureTime + getDuration(item);
      const newPath = [...current.path, item];

      // If the destination is reached, save the route
      if (nextLocationKey === to.toLowerCase()) {
        const totalFare = newPath.reduce(
          (total, transport) => total + Number(transport.fare),
          0
        );

        alternativeRoutes.push({
          path: newPath,
          totalFare,
        });

        continue;
      }

      const newVisited = new Set(current.visited);
      newVisited.add(nextLocationKey);

      queue.push({
        currentLocation: nextLocation,
        path: newPath,
        visited: newVisited,
        arrivalTime,
      });
    }
  }

  // Show cheaper alternative routes first
  return alternativeRoutes.sort(
    (a, b) => a.totalFare - b.totalFare
  );
};

const FindTransport = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");

  const [results, setResults] = useState([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (
      !from.trim() ||
      !to.trim() ||
      !travelDate ||
      !travelTime
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      alert("Starting point and destination cannot be the same");
      return;
    }

    // Find direct transport options
    const directResults = transportData.filter(
      (item) =>
        item.from.toLowerCase() === from.trim().toLowerCase() &&
        item.to.toLowerCase() === to.trim().toLowerCase() &&
        isTimeAvailable(item, travelTime)
    );

    // Find routes that need more than one transport
    const alternativeResults = findAlternativeRoutes(
      from.trim(),
      to.trim(),
      travelTime
    );

    setResults(directResults);
    setAlternativeRoutes(alternativeResults);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    setTravelDate("");
    setTravelTime("");

    setResults([]);
    setAlternativeRoutes([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#142B45]">
            Find Your Transport
          </h1>

          <p className="mt-2 text-gray-500">
            Find available transport and alternative routes for your journey.
          </p>
        </div>

        {/* Search Form */}
        <div className="rounded-xl bg-white p-6 shadow-md">

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Starting Point
              </label>

              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Enter starting location"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Destination
              </label>

              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter destination"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Travel Date
              </label>

              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Travel Time
              </label>

              <input
                type="time"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={handleSearch}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Search Transport
            </button>

            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Reset
            </button>

          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-8">

            <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-[#142B45]">
                Journey Details
              </h2>

              <div className="grid gap-3 text-gray-600 sm:grid-cols-2">
                <p>
                  <span className="font-semibold">From:</span> {from}
                </p>

                <p>
                  <span className="font-semibold">To:</span> {to}
                </p>

                <p>
                  <span className="font-semibold">Date:</span> {travelDate}
                </p>

                <p>
                  <span className="font-semibold">Time:</span> {travelTime}
                </p>
              </div>
            </div>

            {/* Direct Transport */}
            <section className="mb-8">

              <h2 className="mb-4 text-xl font-bold text-[#142B45]">
                Direct Transport
              </h2>

              {results.length > 0 ? (
                <div className="grid gap-4">

                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <h3 className="text-lg font-bold text-blue-700">
                          {item.type}
                        </h3>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                          Direct Route
                        </span>

                      </div>

                      <div className="mt-4 grid gap-3 text-gray-600 sm:grid-cols-2">

                        <p>
                          <span className="font-semibold">From:</span>{" "}
                          {item.from}
                        </p>

                        <p>
                          <span className="font-semibold">To:</span>{" "}
                          {item.to}
                        </p>

                        <p>
                          <span className="font-semibold">Start:</span>{" "}
                          {item.startTime}
                        </p>

                        <p>
                          <span className="font-semibold">End:</span>{" "}
                          {item.endTime}
                        </p>

                      </div>

                      <p className="mt-4 font-bold text-[#142B45]">
                        Fare: ₹{item.fare}
                      </p>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="rounded-lg bg-orange-50 p-4 text-orange-700">
                  No direct transport found for this journey.
                </p>
              )}

            </section>

            {/* Alternative Routes */}
            <section>

              <h2 className="mb-4 text-xl font-bold text-[#142B45]">
                Alternative Routes
              </h2>

              {alternativeRoutes.length > 0 ? (
                <div className="grid gap-4">

                  {alternativeRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <h3 className="mb-4 font-bold text-blue-700">
                        Alternative Route {index + 1}
                      </h3>

                      <div className="space-y-4">

                        {route.path.map((item, legIndex) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-slate-50 p-4"
                          >
                            <p className="mb-2 text-sm font-semibold text-gray-500">
                              {legIndex === 0
                                ? "First Transport"
                                : `Transfer ${legIndex}`}
                            </p>

                            <p className="font-semibold text-[#142B45]">
                              {item.from} → {item.to}
                            </p>

                            <p className="mt-1 text-gray-600">
                              {item.type} | {item.startTime} - {item.endTime}
                            </p>

                            <p className="mt-1 text-gray-600">
                              Fare: ₹{item.fare}
                            </p>
                          </div>
                        ))}

                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <p className="font-bold text-[#142B45]">
                          Total Fare: ₹{route.totalFare}
                        </p>
                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <p className="rounded-lg bg-gray-100 p-4 text-gray-600">
                  No alternative routes found for this journey.
                </p>
              )}

            </section>

          </div>
        )}

      </div>
    </div>
  );
};

export default FindTransport;
