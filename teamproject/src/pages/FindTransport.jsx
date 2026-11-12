import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Calendar,
  Clock,
  Info,
  LoaderCircle,
  MapPin,
  RotateCcw,
  Search,
  SearchX,
  TriangleAlert,
} from "lucide-react";
import transportData from "../data/transportData";
import TransportCard from "../components/TransportCard";
import {
  SEARCH_RULES,
  formatClock,
  formatDate,
  formatDuration,
  getDayOffset,
  getDirectHighlights,
  getKnownLocations,
  getLocalDateString,
  getRouteHighlights,
  getRoutePlaces,
  normalizeLocation,
  searchTransport,
} from "../utils/routeFinder";

// ---------------------------------------------------------------------------
// FindTransport page
//
// This page only collects the journey, shows a loading state, and displays the
// results. ALL searching, time calculation, BFS and ranking happens in
// utils/routeFinder.js (unchanged logic). The cards live in TransportCard.jsx.
//
// Veyora colours: Navy #142B45, Blue #2563EB, Teal #14B8A6, Light #F8FAFC, White.
// ---------------------------------------------------------------------------

// The search itself is instant (it reads sample data in memory). This short pause
// only lets the "Searching..." state show, so the screen does not flash.
const SEARCH_DELAY_MS = 500;

// Place names that exist in the sample data (used for the typing suggestions)
const KNOWN_LOCATIONS = getKnownLocations(transportData);

const QUICK_TIMES = [
  { label: "9 PM", value: "21:00" },
  { label: "10 PM", value: "22:00" },
  { label: "11 PM", value: "23:00" },
  { label: "12 AM", value: "00:00" },
];

// Ready-made searches so the features can be shown quickly
const EXAMPLE_SEARCHES = [
  { label: "Direct options", from: "Tirunelveli", to: "Madurai", time: "17:30" },
  { label: "Overnight train", from: "Tirunelveli", to: "Chennai", time: "20:30" },
  { label: "Needs a connection", from: "Tirunelveli", to: "Chennai", time: "21:30" },
];

// A tiny fade-and-rise animation for results. It is defined here so no shared CSS
// file has to change, and it switches off for people who prefer reduced motion.
const ANIMATION_CSS = `
@keyframes veyora-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.veyora-rise { animation: veyora-rise 0.35s ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .veyora-rise { animation: none; }
}
`;

// ------------------------------- Helpers -----------------------------------

// Returns an object of error messages (empty object = everything is fine)
const validateSearch = ({ from, to, travelDate, travelTime }) => {
  const errors = {};

  if (!from.trim()) errors.from = "Enter your starting point.";
  if (!to.trim()) errors.to = "Enter your destination.";

  if (!errors.from && !errors.to && normalizeLocation(from) === normalizeLocation(to)) {
    errors.to = "Destination must be different from the starting point.";
  }

  if (!travelDate) errors.travelDate = "Choose a travel date.";
  if (!travelTime) errors.travelTime = "Choose a departure time.";

  return errors;
};

// A route is identified by the ids of the vehicles it uses, e.g. "4-5-13"
const getRouteKey = (route) => route.legs.map((leg) => leg.option.id).join("-");

const inputClass = (hasError) =>
  `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-[#142B45] outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "border-slate-300 focus:border-[#2563EB] focus:ring-[#2563EB]/15"
  }`;

// ------------------------------ Small pieces -------------------------------

// A label + input with an icon, plus an error message underneath
const Field = ({ id, label, icon: Icon, error, footer, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#142B45]">
      {label}
    </label>

    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      {children}
    </div>

    {footer}

    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 flex items-center gap-1.5 text-sm text-red-600"
      >
        <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

const Chip = ({ active = false, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
      active
        ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
        : "border-slate-200 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB]"
    }`}
  >
    {children}
  </button>
);

const SectionTitle = ({ title, count, children }) => (
  <div className="mb-4">
    <h2 className="flex items-center gap-2 text-xl font-bold text-[#142B45]">
      {title}
      {count !== undefined && (
        <span className="rounded-full bg-[#142B45] px-2.5 py-0.5 text-sm font-semibold text-white">
          {count}
        </span>
      )}
    </h2>
    {children}
  </div>
);

// Grey placeholder cards shown while "searching"
const LoadingState = () => (
  <div role="status" aria-live="polite">
    <p className="mb-4 flex items-center gap-2 font-semibold text-[#142B45]">
      <LoaderCircle className="h-5 w-5 animate-spin text-[#2563EB]" aria-hidden="true" />
      Searching the sample timetable…
    </p>

    <div className="grid gap-4" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="h-10 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Shown before the first search
const IntroState = () => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#142B45]">
      <Search className="h-6 w-6 text-[#14B8A6]" aria-hidden="true" />
    </span>
    <h2 className="mt-4 text-xl font-bold text-[#142B45]">Where are you heading tonight?</h2>
    <p className="mx-auto mt-2 max-w-lg text-slate-600">
      Enter your journey above. Veyora shows direct options first. If nothing runs
      directly, it builds connecting routes and checks every transfer.
    </p>
  </div>
);

// Shown when there is nothing to display (unknown place, or no valid route)
const NoRouteState = ({ query, unknownLocations }) => {
  const isUnknown = unknownLocations.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#142B45]">
        <SearchX className="h-6 w-6 text-[#14B8A6]" aria-hidden="true" />
      </span>

      <h2 className="mt-4 text-xl font-bold text-[#142B45]">
        {isUnknown ? "We don't have that place yet" : "No route found"}
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-slate-600">
        {isUnknown
          ? `No sample data for ${unknownLocations.map((place) => `"${place}"`).join(" and ")}. Check the spelling or pick one of the places below.`
          : `No direct or connecting route from ${query.from} to ${query.to} fits your time. Try an earlier departure, because connections must leave within ${formatDuration(
              SEARCH_RULES.maxInitialWaitMinutes
            )} of your selected time.`}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {KNOWN_LOCATIONS.map((place) => (
          <span
            key={place}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
          >
            {place}
          </span>
        ))}
      </div>
    </div>
  );
};

// A compact table so the alternative routes can be compared side by side
const RouteComparison = ({ routes, highlights, travelDate, onSelect }) => (
  <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {/* "relative" keeps the screen-reader-only text inside this scroll box */}
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Comparison of alternative routes</caption>
        <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Route</th>
            <th scope="col" className="px-4 py-3">Change at</th>
            <th scope="col" className="px-4 py-3">Fare</th>
            <th scope="col" className="px-4 py-3">Journey time</th>
            <th scope="col" className="px-4 py-3">Waiting</th>
            <th scope="col" className="px-4 py-3">Transfers</th>
            <th scope="col" className="px-4 py-3">Arrives</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Details</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[#142B45]">
          {routes.map((route, index) => (
            <tr key={getRouteKey(route)} className="transition hover:bg-[#F8FAFC]">
              <td className="px-4 py-3 font-bold">
                #{index + 1}
                {highlights[index].badges[0] && (
                  <span className="ml-2 text-xs font-semibold text-[#2563EB]">
                    {highlights[index].badges[0]}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{getRoutePlaces(route).slice(1, -1).join(", ")}</td>
              <td className="px-4 py-3 font-semibold">₹{route.totalFare}</td>
              <td className="px-4 py-3">{formatDuration(route.totalDuration)}</td>
              <td className="px-4 py-3">{formatDuration(route.totalWaiting)}</td>
              <td className="px-4 py-3">{route.transfers}</td>
              <td className="px-4 py-3">
                {formatClock(route.arrival)}
                <span className="ml-1 text-xs text-slate-500">
                  {formatDate(travelDate, getDayOffset(route.arrival))}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onSelect(route)}
                  className="font-semibold text-[#2563EB] hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --------------------------------- Page ------------------------------------

const FindTransport = () => {
  // What the user is typing right now
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");

  // Which "Today / Tomorrow" shortcut was used (so it can look selected)
  const [dateShortcut, setDateShortcut] = useState(null);

  const [errors, setErrors] = useState({}); // messages under the fields
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(""); // something unexpected went wrong

  // A saved copy of the search. Results are shown from this copy, so editing the
  // inputs afterwards does not change them.
  // Shape: { query, directOptions, alternativeRoutes, unknownLocations,
  //          directHighlights, routeHighlights }
  const [searchResult, setSearchResult] = useState(null);

  // Which alternative routes are opened to show their full timeline
  const [openRoutes, setOpenRoutes] = useState([]);

  const resultsRef = useRef(null);
  const timerRef = useRef(null);

  // Stop a pending search if the page is closed
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // When a search starts, bring the results area into view (helpful on phones)
  useEffect(() => {
    if (!isLoading) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView?.({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [isLoading]);

  const clearError = (field) => setErrors((previous) => ({ ...previous, [field]: undefined }));

  const runSearch = (values) => {
    const validationErrors = validateSearch(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const query = {
      from: values.from.trim(),
      to: values.to.trim(),
      travelDate: values.travelDate,
      travelTime: values.travelTime,
    };

    clearTimeout(timerRef.current);
    setSearchError("");
    setSearchResult(null);
    setIsLoading(true);

    timerRef.current = setTimeout(() => {
      try {
        const found = searchTransport(transportData, query.from, query.to, query.travelTime);
        const routeHighlights = getRouteHighlights(found.alternativeRoutes);

        setSearchResult({
          query,
          ...found,
          directHighlights: getDirectHighlights(found.directOptions),
          routeHighlights,
        });

        // Open the best alternative route by default
        setOpenRoutes(
          found.alternativeRoutes.length > 0 ? [getRouteKey(found.alternativeRoutes[0])] : []
        );
      } catch {
        setSearchError("Something went wrong while searching. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_DELAY_MS);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch({ from, to, travelDate, travelTime });
  };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    setFrom("");
    setTo("");
    setTravelDate("");
    setTravelTime("");
    setDateShortcut(null);
    setErrors({});
    setSearchError("");
    setSearchResult(null);
    setOpenRoutes([]);
    setIsLoading(false);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setErrors((previous) => ({ ...previous, from: undefined, to: undefined }));
  };

  const handleDateShortcut = (name, offsetDays) => {
    setTravelDate(getLocalDateString(offsetDays));
    setDateShortcut(name);
    clearError("travelDate");
  };

  const handleExample = (example) => {
    const values = {
      from: example.from,
      to: example.to,
      travelDate: getLocalDateString(0),
      travelTime: example.time,
    };

    setFrom(values.from);
    setTo(values.to);
    setTravelDate(values.travelDate);
    setTravelTime(values.travelTime);
    setDateShortcut("today");
    runSearch(values);
  };

  const toggleRoute = (key) =>
    setOpenRoutes((previous) =>
      previous.includes(key) ? previous.filter((item) => item !== key) : [...previous, key]
    );

  // From the comparison table: open that route and scroll to it
  const selectRoute = (route) => {
    const key = getRouteKey(route);

    setOpenRoutes((previous) => (previous.includes(key) ? previous : [...previous, key]));
    window.requestAnimationFrame(() =>
      document.getElementById(`route-${key}`)?.scrollIntoView?.({ behavior: "smooth", block: "start" })
    );
  };

  const hasDirect = searchResult !== null && searchResult.directOptions.length > 0;
  const hasAlternatives = searchResult !== null && searchResult.alternativeRoutes.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <style>{ANIMATION_CSS}</style>

      {/* Title banner */}
      <div className="bg-[#142B45] px-4 pb-24 pt-10 text-center text-white sm:pb-28">
        <h1 className="text-3xl font-bold sm:text-4xl">Find Your Transport</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-300">
          Find available transport and alternative routes for your journey.
        </p>
      </div>

      <div className="mx-auto -mt-16 max-w-5xl px-4 pb-16 sm:-mt-20">
        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
            <Field id="from" label="Starting Point" icon={MapPin} error={errors.from}>
              <input
                id="from"
                type="text"
                value={from}
                onChange={(event) => {
                  setFrom(event.target.value);
                  clearError("from");
                }}
                list="known-locations"
                autoComplete="off"
                placeholder="Enter starting location"
                aria-invalid={Boolean(errors.from)}
                aria-describedby={errors.from ? "from-error" : undefined}
                className={inputClass(errors.from)}
              />
            </Field>

            <div className="flex justify-center md:pt-[30px]">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap starting point and destination"
                className="flex h-11 w-11 rotate-90 items-center justify-center rounded-full border border-slate-200 bg-white text-[#2563EB] shadow-sm transition hover:bg-[#F8FAFC] hover:shadow md:rotate-0"
              >
                <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <Field id="to" label="Destination" icon={MapPin} error={errors.to}>
              <input
                id="to"
                type="text"
                value={to}
                onChange={(event) => {
                  setTo(event.target.value);
                  clearError("to");
                }}
                list="known-locations"
                autoComplete="off"
                placeholder="Enter destination"
                aria-invalid={Boolean(errors.to)}
                aria-describedby={errors.to ? "to-error" : undefined}
                className={inputClass(errors.to)}
              />
            </Field>
          </div>

          {/* Typing suggestions: places that exist in the sample data */}
          <datalist id="known-locations">
            {KNOWN_LOCATIONS.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              id="travelDate"
              label="Travel Date"
              icon={Calendar}
              error={errors.travelDate}
              footer={
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip
                    active={dateShortcut === "today"}
                    onClick={() => handleDateShortcut("today", 0)}
                  >
                    Today
                  </Chip>
                  <Chip
                    active={dateShortcut === "tomorrow"}
                    onClick={() => handleDateShortcut("tomorrow", 1)}
                  >
                    Tomorrow
                  </Chip>
                </div>
              }
            >
              <input
                id="travelDate"
                type="date"
                value={travelDate}
                onChange={(event) => {
                  setTravelDate(event.target.value);
                  setDateShortcut(null);
                  clearError("travelDate");
                }}
                aria-invalid={Boolean(errors.travelDate)}
                aria-describedby={errors.travelDate ? "travelDate-error" : undefined}
                className={inputClass(errors.travelDate)}
              />
            </Field>

            <Field
              id="travelTime"
              label="Preferred Departure Time"
              icon={Clock}
              error={errors.travelTime}
              footer={
                <div className="mt-2 flex flex-wrap gap-2">
                  {QUICK_TIMES.map((time) => (
                    <Chip
                      key={time.value}
                      active={travelTime === time.value}
                      onClick={() => {
                        setTravelTime(time.value);
                        clearError("travelTime");
                      }}
                    >
                      {time.label}
                    </Chip>
                  ))}
                </div>
              }
            >
              <input
                id="travelTime"
                type="time"
                value={travelTime}
                onChange={(event) => {
                  setTravelTime(event.target.value);
                  clearError("travelTime");
                }}
                aria-invalid={Boolean(errors.travelTime)}
                aria-describedby={errors.travelTime ? "travelTime-error" : undefined}
                className={inputClass(errors.travelTime)}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="h-5 w-5" aria-hidden="true" />
              )}
              {isLoading ? "Searching…" : "Search Transport"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-[#142B45] transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">Try a sample search:</span>
            {EXAMPLE_SEARCHES.map((example) => (
              <Chip key={example.label} onClick={() => handleExample(example)}>
                {example.label}
              </Chip>
            ))}
          </div>
        </form>

        {/* Results */}
        <section ref={resultsRef} className="mt-8 scroll-mt-4">
          {isLoading && <LoadingState />}

          {searchError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700"
            >
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {searchError}
            </div>
          )}

          {!isLoading && !searchError && searchResult === null && <IntroState />}

          {searchResult && (
            <div>
              {/* Journey summary (from the saved search, so it never changes by itself) */}
              <div className="veyora-rise mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#142B45]">
                  <p className="flex items-center gap-2 text-lg font-bold">
                    <MapPin className="h-5 w-5 text-[#14B8A6]" aria-hidden="true" />
                    {searchResult.query.from} → {searchResult.query.to}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {formatDate(searchResult.query.travelDate)}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    From {searchResult.query.travelTime}
                  </p>
                </div>

                <p
                  role="status"
                  className="mt-3 text-sm font-semibold text-[#142B45]"
                >
                  {hasDirect
                    ? `${searchResult.directOptions.length} direct ${
                        searchResult.directOptions.length === 1 ? "option" : "options"
                      } found`
                    : hasAlternatives
                      ? `No direct transport. ${searchResult.alternativeRoutes.length} connecting ${
                          searchResult.alternativeRoutes.length === 1 ? "route" : "routes"
                        } found`
                      : "No transport found"}
                </p>

                <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#2563EB]/5 p-3 text-sm text-[#142B45]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
                  Sample data: timings, fares and availability are for demonstration only. They are
                  not live availability.
                </p>
              </div>

              {/* Feature 1: direct transport */}
              {hasDirect && (
                <section>
                  <SectionTitle title="Direct transport" count={searchResult.directOptions.length} />

                  <div className="grid gap-4">
                    {searchResult.directOptions.map((leg, index) => (
                      <div
                        key={leg.option.id}
                        className="veyora-rise"
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        <TransportCard
                          variant="direct"
                          leg={leg}
                          travelDate={searchResult.query.travelDate}
                          tags={searchResult.directHighlights[index]}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Feature 2: alternative routes (only when there is NO direct transport) */}
              {!hasDirect && hasAlternatives && (
                <section>
                  <div className="veyora-rise mb-6 flex items-start gap-3 rounded-2xl border-l-4 border-[#14B8A6] bg-white p-5 shadow-sm">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-[#142B45]">No direct transport for this journey</p>
                      <p className="mt-1 text-slate-600">
                        Nothing runs directly from {searchResult.query.from} to{" "}
                        {searchResult.query.to} within{" "}
                        {formatDuration(SEARCH_RULES.maxInitialWaitMinutes)} of{" "}
                        {searchResult.query.travelTime}. These connecting routes are available instead.
                      </p>
                    </div>
                  </div>

                  <SectionTitle title="Alternative routes" count={searchResult.alternativeRoutes.length}>
                    <p className="mt-1 text-sm text-slate-600">
                      Ranked by journey time ({Math.round(SEARCH_RULES.durationWeight * 100)}%) and
                      fare ({Math.round(SEARCH_RULES.fareWeight * 100)}%). Each transfer needs at
                      least {SEARCH_RULES.minTransferMinutes} minutes and at most{" "}
                      {formatDuration(SEARCH_RULES.maxTransferWaitMinutes)} of waiting, with up to{" "}
                      {SEARCH_RULES.maxLegs} vehicles.
                    </p>
                  </SectionTitle>

                  {searchResult.alternativeRoutes.length > 1 && (
                    <RouteComparison
                      routes={searchResult.alternativeRoutes}
                      highlights={searchResult.routeHighlights}
                      travelDate={searchResult.query.travelDate}
                      onSelect={selectRoute}
                    />
                  )}

                  <div className="grid gap-4">
                    {searchResult.alternativeRoutes.map((route, index) => {
                      const key = getRouteKey(route);

                      return (
                        <div
                          key={key}
                          className="veyora-rise"
                          style={{ animationDelay: `${index * 70}ms` }}
                        >
                          <TransportCard
                            variant="route"
                            route={route}
                            index={index}
                            highlight={searchResult.routeHighlights[index]}
                            travelDate={searchResult.query.travelDate}
                            isOpen={openRoutes.includes(key)}
                            onToggle={() => toggleRoute(key)}
                            elementId={`route-${key}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Nothing at all, or a place we do not know */}
              {!hasDirect && !hasAlternatives && (
                <NoRouteState
                  query={searchResult.query}
                  unknownLocations={searchResult.unknownLocations}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FindTransport;
