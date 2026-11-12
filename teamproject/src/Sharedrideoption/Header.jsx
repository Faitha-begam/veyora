import { Circle, Dot } from "lucide-react";
import { CirclePlus , ShieldCheck , Search , Car , MapPin , Compass , MapPinHouse , Clock } from "lucide-react";

const Header = () => {
  return (
    <>
    <div className="bg-[#122a43f8] p-2 text-white border-b-2 border-white/10">
        <div className="flex justify-between items-center ">
            <div className="mx-10 flex items-center">
                <div className=" bg-emerald-500/15 text-emerald-300 px-2.5 py-1 inline-flex gap-1.5 items-center text-[11px] font-semibold rounded-full border-2 border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      Night Safety Network Active
                </div>
                <div className="flex items-center">
                  <span className="text-slate-400 text-2xl hidden sm:inline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                    viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                    stroke-linejoin="round" class="lucide lucide-dot preview-icon">
                    <circle cx="12" cy="12" r="1"/></svg>
                  </span>
                  <span className="text-slate-400 text-[12px] font-semibold hidden sm:inline">Mutual Aadhaar/DigiLocker verification with 24x7 India SOS 112 Link</span>
                </div>
            </div>
            <div className="mx-10 flex items-center gap-4">
                <label className="flex items-center cursor-pointer gap-2">
                  <span className="text-[13px] font-medium text-pink-300 hover:text-pink-200">Women-Only Rides</span>
                  <input type="checkbox" className="w-4 h-4 rounded text-pink-600 bg-slate-800 border-slate-700 cursor-pointer focus:ring-pink-500"/>
                </label>
                <button className="bg-red-600 px-2.5 py-1 text-[11px] font-bold rounded hover:bg-red-500 shadow-lg shadow-red-900/5  animate-pulse">SOS 112</button>
            </div>
        </div>
    </div>
    <div className="bg-[#0e233a] p-5 shadow-2xl text-white border-b-2 border-white/10"> 
      <div className="mx-20 flex justify-between">
        <div className="flex">
          <div className="flex items-center text-slate-400">
            <h1 className="text-2xl font-black">VEYORA</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9.5 L12 21.5"/>
            </svg>
          </div>
          <div className="bg-white/10 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border-2 border-white/20 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Feature 4: Shared Ride Option
          </div>
        </div>
        <div className="flex gap-2.5">
          <div className="bg-[#2564ebea] flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-xl shadow-2xl">
            <CirclePlus size={20} />
            <button>Offer Empty Seats</button>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-xl border-2 border-white/10 flex items-center gap-1.5 text-[14px] font-semibold">
            <ShieldCheck size={20} className="text-emerald-400"/>
            <button>Trust & Safety</button>
          </div>
        </div>
      </div>
    </div>

    <section className="mx-15 mt-10 mb-5">
      <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-black/15">
        <div className="flex justify-between items-center p-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-black">Share a Ride along Your Night Route</h1>
            <p className="text-sm text-gray-600">Connect with verified commuters travelling your way during late hours. Split fares safely  with verified co-passengers,<br /> live GPS tracking, and instant SOS alerts.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow flex gap-1.5 items-center">
              <Search size={16} />
              <button>Find Matching Ride</button>
            </div>
            <div className="bg-black/40 px-4 py-2 text-white rounded-xl  flex items-center gap-1.5">
              <Car size={20}/>
              <button>Offer Your Empty Seats</button>
            </div>
          </div>
        </div>

        <div className="mx-5">
          <div className="flex gap-8 items-center">
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-emerald-400"/>
                <span className="text-slate-500 text-[13px] font-semibold">PICKUP POINT</span>
              </div>
              <input type="text" placeholder="e.g. KK Nagar" 
              className="bg-gray-200  px-4 py-2 shadow-2xl rounded-lg w-80 border border-black/20 focus:outline-none"/>
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <MapPinHouse size={15} className="text-violet-600"/>
                <span className="text-slate-500 text-[13px] font-semibold">DESTINATION</span>
              </div>
              <input type="text" placeholder="e.g. KK Nagar" 
              className="bg-gray-200 px-4 py-2 shadow-2xl rounded-lg w-80 border border-black/20 focus:outline-none"/>
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-yellow-400"/>
                <span className="text-slate-500 text-[13px] font-semibold">TRAVEL TIME (TONIGHT)</span>
              </div>
              <input type="time" placeholder="e.g. KK Nagar" 
              className="bg-gray-200 px-4 py-2 shadow-2xl rounded-lg w-80 border border-black/20 focus:outline-none"/>
            </label>

            <div className="bg-blue-500 text-white w-60 px-4 py-2 rounded-xl flex justify-center gap-1.5 items-center mx-5">
              <Compass size={15}/>
              <button>Match Shared Ride</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div>
        
      </div>
    </section>
    </>
  )
}

export default Header