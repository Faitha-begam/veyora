
import { useState } from "react";
import transportData from "../data/transportData";

const FindTransport = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");

  const [results, setResults] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Convert time into minutes
  const convertTime = (time) => {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  };

  // Check whether a service is running at the selected time
  const isTimeAvailable = (startTime, endTime, userTime) => {
    const start = convertTime(startTime);
    const end = convertTime(endTime);

    if (start <= end) {
      return userTime >= start && userTime <= end;
    }

    return userTime >= start || userTime <= end;
  };

  // Find connecting alternative routes
  const findAlternativeRoutes = () => {
    const alternatives = [];
    const userTime = convertTime(travelTime);

    const firstRoutes = transportData.filter((item) => {
      return (
        item.from.toLowerCase() === from.trim().toLowerCase() &&
        isTimeAvailable(item.startTime, item.endTime, userTime)
      );
    });

    firstRoutes.forEach((first) => {
      if (first.to.toLowerCase() === to.trim().toLowerCase()) {
        return;
      }

      const secondRoutes = transportData.filter((item) => {
        if (
          item.from.toLowerCase() !== first.to.toLowerCase() ||
          item.to.toLowerCase() !== to.trim().toLowerCase()
        ) {
          return false;
        }

        const firstArrival = convertTime(first.endTime);
        let secondDeparture = convertTime(item.startTime);

        // Handle travel continuing after midnight
        if (secondDeparture < convertTime(first.startTime)) {
          secondDeparture += 1440;
        }

        let arrival = firstArrival;

        if (arrival < convertTime(first.startTime)) {
          arrival += 1440;
        }

        // Require at least 15 minutes for a connection
        return (
          secondDeparture >= arrival + 15 &&
          secondDeparture <= arrival + 180
        );
      });

      secondRoutes.forEach((second) => {
        alternatives.push({
          id: `${first.id}-${second.id}`,
          via: first.to,
          first,
          second,
          totalFare: first.fare + second.fare,
        });
      });
    });

    return alternatives;
  };

  // Search transport
  const handleSearch = () => {
    if (!from.trim() || !to.trim() || !travelDate || !travelTime) {
      alert("Please fill all the fields");
      return;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      alert("Starting location and destination cannot be the same");
      return;
    }

    const userTime = convertTime(travelTime);

    const directResults = transportData.filter((item) => {
      const matchesRoute =
        item.from.toLowerCase() === from.trim().toLowerCase() &&
        item.to.toLowerCase() === to.trim().toLowerCase();

      const matchesTime = isTimeAvailable(
        item.startTime,
        item.endTime,
        userTime
      );

      return matchesRoute && matchesTime;
    });

    setResults(directResults);

    if (directResults.length === 0) {
      setAlternatives(findAlternativeRoutes());
    } else {
      setAlternatives([]);
    }

    setHasSearched(true);
  };

  // Reset search
  const handleReset = () => {
    setFrom("");
    setTo("");
    setTravelDate("");
    setTravelTime("");
    setResults([]);
    setAlternatives([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#142B45]">
            Find Alternative Transport
          </h1>

          <p className="mt-2 text-slate-600">
            No transport available? Find another way to reach
            your destination safely.
          </p>
        </div>

        {/* Search Form */}
        <div className="rounded-xl bg-white p-6 shadow-md">

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium text-[#142B45]">
                Starting Location
              </label>

              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Enter starting location"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#142B45]">
                Destination
              </label>

              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter destination"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#142B45]">
                Travel Date
              </label>

              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#142B45]">
                Travel Time
              </label>

              <input
                type="time"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={handleSearch}
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Search Transport
            </button>

            <button
              onClick={handleReset}
              className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Reset
            </button>

          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="mt-8">

            {/* Journey Details */}
            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#142B45]">
                Your Journey
              </h2>

              <p className="mt-3 text-slate-600">
                📍 {from} → {to}
              </p>

              <p className="mt-2 text-slate-600">
                📅 {travelDate}
              </p>

              <p className="mt-2 text-slate-600">
                🕒 {travelTime}
              </p>
            </div>

            {/* Direct Transport */}
            {results.length > 0 ? (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-green-700">
                  Available Transport
                </h2>

                <div className="grid gap-4">

                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-green-200 bg-white p-5 shadow-md"
                    >
                      <h3 className="text-xl font-bold text-[#142B45]">
                        {item.type}
                      </h3>

                      <p className="mt-2 text-slate-600">
                        {item.from} → {item.to}
                      </p>

                      <p className="mt-2 text-slate-600">
                        Departure: {item.startTime}
                      </p>

                      <p className="text-slate-600">
                        Arrival: {item.endTime}
                      </p>

                      <p className="mt-3 font-bold text-blue-600">
                        Fare: ₹{item.fare}
                      </p>
                    </div>
                  ))}

                </div>
              </div>
            ) : (

              /* No Direct Transport */
              <div className="rounded-xl border border-red-200 bg-red-50 p-6">

                <h2 className="text-2xl font-bold text-red-600">
                  No Direct Transport Available!
                </h2>

                <p className="mt-2 text-slate-700">
                  Don't worry! We are checking alternative routes
                  for your journey.
                </p>

              </div>
            )}

            {/* Alternative Routes */}
            {results.length === 0 && (
              <div className="mt-8">

                <h2 className="mb-5 text-2xl font-bold text-[#142B45]">
                  Alternative Travel Suggestions
                </h2>

                {alternatives.length > 0 ? (
                  <div className="grid gap-5">

                    {alternatives.map((route) => (
                      <div
                        key={route.id}
                        className="rounded-xl border bg-white p-5 shadow-md"
                      >

                        <h3 className="text-xl font-bold text-blue-700">
                          Alternative Route Found
                        </h3>

                        <div className="mt-4 flex flex-wrap items-center gap-3 font-semibold">
                          <span>{from}</span>
                          <span>→</span>
                          <span>{route.via}</span>
                          <span>→</span>
                          <span>{to}</span>
                        </div>

                        <div className="mt-5 space-y-3">

                          <div className="rounded-lg bg-blue-50 p-4">
                            <h4 className="font-bold">
                              {route.first.type}
                            </h4>

                            <p>
                              {route.first.from} → {route.first.to}
                            </p>

                            <p className="text-sm text-slate-600">
                              {route.first.startTime} - {route.first.endTime}
                            </p>

                            <p className="mt-2 font-semibold">
                              Fare: ₹{route.first.fare}
                            </p>
                          </div>

                          <div className="rounded-lg bg-blue-50 p-4">
                            <h4 className="font-bold">
                              {route.second.type}
                            </h4>

                            <p>
                              {route.second.from} → {route.second.to}
                            </p>

                            <p className="text-sm text-slate-600">
                              {route.second.startTime} - {route.second.endTime}
                            </p>

                            <p className="mt-2 font-semibold">
                              Fare: ₹{route.second.fare}
                            </p>
                          </div>

                        </div>

                        <p className="mt-5 font-bold text-green-700">
                          Total Estimated Fare: ₹{route.totalFare}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          Sample route. Verify service timings before travel.
                        </p>

                      </div>
                    ))}

                  </div>
                ) : (

                  <div className="rounded-xl bg-yellow-50 p-5">
                    <h3 className="font-bold text-yellow-800">
                      No Connecting Route Found
                    </h3>

                    <p className="mt-2 text-slate-600">
                      Try another travel time or check local taxi
                      and auto services.
                    </p>
                  </div>

                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default FindTransport;
