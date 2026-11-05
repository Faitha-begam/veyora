

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
                <button className="pulse-sos bg-red-600 px-2.5 py-1 text-[11px] font-bold rounded hover:bg-red-500 shadow-lg shadow-red-900/5  ">SOS 112</button>
            </div>
        </div>
    </div>
    <div className="bg-[#0e233a] p-5 shadow-2xl text-white ">
      <div className="mx-20">
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
        <div>
          <div>

          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Header