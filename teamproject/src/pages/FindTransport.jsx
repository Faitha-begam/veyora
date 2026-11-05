
import { useState } from "react";
import transportData from "../data/transportData";

const isTimeAvailable = (item, travelTime) => {
  const [hours, minutes] = travelTime.split(":");
  const userTime = Number(hours) * 60 + Number(minutes);

  const [startHour, startMinute] = item.startTime.split(":");
  const [endHour, endMinute] = item.endTime.split(":");

  const start = Number(startHour) * 60 + Number(startMinute);
  const end = Number(endHour) * 60 + Number(endMinute);

  return start <= end
    ? userTime >= start && userTime <= end
    : userTime >= start || userTime <= end;
};

const findAlternativeRoutes = (from, to, travelTime) => {
  const queue = [
    {
      currentLocation: from,
      path: [],
      visited: [from]
    }
  ];

  const alternativeRoutes = [];
  const maxLegs = 3;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.path.length >= maxLegs) {
      continue;
    }

    const connections = transportData.filter((item) => {
      return (
        item.from.toLowerCase() ===
          current.currentLocation.toLowerCase() &&
        !current.visited.some(
          (location) =>
            location.toLowerCase() === item.to.toLowerCase()
        )
      );
    });

    connections.forEach((connection) => {
      if (
        current.path.length === 0 &&
        !isTimeAvailable(connection, travelTime)
      ) {
        return;
      }

      const newPath = [...current.path, connection];

      if (connection.to.toLowerCase() === to.toLowerCase()) {
        if (newPath.length > 1) {
          alternativeRoutes.push({
            id: alternativeRoutes.length + 1,
            path: newPath,
            totalFare: newPath.reduce(
              (total, item) => total + item.fare,
              0
            )
          });
        }
      } else {
        queue.push({
          currentLocation: connection.to,
          path: newPath,
          visited: [...current.visited, connection.to]
        });
      }
    });
  }

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

  const handleSearch = () => {
    if (!from.trim() || !to.trim() || !travelDate || !travelTime) {
      alert("Please fill all the fields");
      return;
    }

    const directResults = transportData.filter((item) => {
      const matchesRoute =
        item.from.toLowerCase() === from.trim().toLowerCase() &&
        item.to.toLowerCase() === to.trim().toLowerCase();

      return matchesRoute && isTimeAvailable(item, travelTime);
    });

    setResults(directResults);

    if (directResults.length === 0) {
      const alternatives = findAlternativeRoutes(
        from.trim(),
        to.trim(),
        travelTime
      );

      setAlternativeRoutes(alternatives);
    } else {
      setAlternativeRoutes([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-[#142B45]">
          Find Transport
        </h1>

        <p className="mb-8 text-slate-600">
          Find transport options and alternative routes for your journey.
        </p>

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

          <button
            onClick={handleSearch}
            className="mt-6 w-full rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Search Transport
          </button>
        </div>

        <div className="mt-8">
          {results.length > 0 ? (
            <>
              <h2 className="mb-4 text-xl font-bold text-[#142B45]">
                Direct Transport Results
              </h2>

              <div className="grid gap-4">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-white p-5 shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-[#142B45]">
                      {item.type}
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {item.from} → {item.to}
                    </p>

                    <p className="mt-1 text-slate-600">
                      Departure: {item.startTime}
                    </p>

                    <p className="text-slate-600">
                      Arrival: {item.endTime}
                    </p>

                    <p className="mt-2 font-semibold text-[#2563EB]">
                      Fare: ₹{item.fare}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : alternativeRoutes.length > 0 ? (
            <>
              <h2 className="mb-2 text-xl font-bold text-[#142B45]">
                Alternative Routes
              </h2>

              <p className="mb-4 text-slate-600">
                No matching direct transport found. Here are possible
                connections:
              </p>

              <div className="grid gap-4">
                {alternativeRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-xl bg-white p-5 shadow-md"
                  >
                    <h3 className="mb-3 font-semibold text-[#142B45]">
                      Alternative Route {route.id}
                    </h3>

                    {route.path.map((item, index) => (
                      <div key={item.id} className="mb-3">
                        <p className="font-medium text-blue-700">
                          {item.from} → {item.to}
                        </p>

                        <p className="text-sm text-slate-600">
                          {item.type} | {item.startTime} - {item.endTime}
                        </p>

                        {index < route.path.length - 1 && (
                          <p className="mt-2 text-sm text-slate-500">
                            Change transport at {item.to}
                          </p>
                        )}
                      </div>
                    ))}

                    <p className="border-t pt-3 font-semibold text-[#2563EB]">
                      Total sample fare: ₹{route.totalFare}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-lg bg-white p-5 text-slate-500 shadow-sm">
              No direct transport or alternative route found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTransport;
