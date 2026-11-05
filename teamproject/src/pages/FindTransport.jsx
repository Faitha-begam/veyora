const FindTransport = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <h1 className="text-3xl font-bold text-center text-[#142B45]"> Find Your Night Transport </h1>

      <p className="text-center text-gray-500 mt-2"> Find transport options and alternative routes for your journey.</p>

     <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label>Starting Location</label>
            <input type="text" placeholder="Enter starting point" className="w-full border p-3 rounded-lg mt-2" />
          </div>

          <div>
            <label>Destination</label>
            <input type="text" placeholder="Enter destination" className="w-full border p-3 rounded-lg mt-2" />
          </div>

          <div>
            <label>Travel Date</label>
            <input type="date" className="w-full border p-3 rounded-lg mt-2" />
          </div>

          <div>
            <label>Travel Time</label>
            <input type="time" className="w-full border p-3 rounded-lg mt-2" />
          </div>

        </div>

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg mt-6">
          Search Transport
        </button>

      </div>
    </div>
  );
};

export default FindTransport;