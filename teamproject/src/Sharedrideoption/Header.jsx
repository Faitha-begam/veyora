import { useState } from "react";
import { Circle, Dot } from "lucide-react";
import { CirclePlus , ShieldCheck , Search , Car , MapPin , Compass , MapPinHouse , Clock, X, CheckCircle2 } from "lucide-react";

// Mock initial rides dataset
const initialRidesData = [
  // KK Nagar -> OMR
  {
    id: 1,
    driverName: "Priya Sharma",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "KK Nagar",
    destination: "OMR",
    time: "21:30",
    vehicle: "Tata Nexon EV",
    seats: 2,
    price: "₹120"
  },
  {
    id: 2,
    driverName: "Karthik Raja",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "KK Nagar",
    destination: "OMR",
    time: "21:45",
    vehicle: "Honda City",
    seats: 1,
    price: "₹140"
  },

  // KK Nagar -> Velachery
  {
    id: 3,
    driverName: "Divya R.",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "KK Nagar",
    destination: "Velachery",
    time: "21:50",
    vehicle: "Maruti Swift",
    seats: 2,
    price: "₹95"
  },
  {
    id: 4,
    driverName: "Arun Kumar",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "KK Nagar",
    destination: "Velachery",
    time: "22:00",
    vehicle: "Hyundai i20",
    seats: 3,
    price: "₹90"
  },

  // KK Nagar -> Anna Nagar
  {
    id: 5,
    driverName: "Dr. Deepa Sundaram",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "KK Nagar",
    destination: "Anna Nagar",
    time: "22:15",
    vehicle: "Maruti Brezza",
    seats: 2,
    price: "₹110"
  },
  {
    id: 6,
    driverName: "Rajesh Varma",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "KK Nagar",
    destination: "Anna Nagar",
    time: "22:00",
    vehicle: "Honda Amaze",
    seats: 2,
    price: "₹100"
  },

  // KK Nagar -> T. Nagar
  {
    id: 7,
    driverName: "Kavitha Raman",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "KK Nagar",
    destination: "T. Nagar",
    time: "22:45",
    vehicle: "Maruti Baleno",
    seats: 1,
    price: "₹75"
  },
  {
    id: 8,
    driverName: "Suresh Menon",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "KK Nagar",
    destination: "T. Nagar",
    time: "22:15",
    vehicle: "Hyundai Creta",
    seats: 3,
    price: "₹85"
  },

  // Guindy -> KK Nagar
  {
    id: 9,
    driverName: "Ananya Iyer",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "Guindy",
    destination: "KK Nagar",
    time: "21:15",
    vehicle: "Tata Tiago EV",
    seats: 2,
    price: "₹80"
  },
  {
    id: 10,
    driverName: "Dinesh Kumar",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "Guindy",
    destination: "KK Nagar",
    time: "21:40",
    vehicle: "Maruti Dzire",
    seats: 2,
    price: "₹70"
  },

  // Guindy -> OMR
  {
    id: 11,
    driverName: "Meera Krishnan",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "Guindy",
    destination: "OMR",
    time: "22:00",
    vehicle: "Kia Sonet",
    seats: 2,
    price: "₹130"
  },
  {
    id: 12,
    driverName: "Vijay Sethupathi",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "Guindy",
    destination: "OMR",
    time: "21:30",
    vehicle: "Toyota Glanza",
    seats: 3,
    price: "₹125"
  },

  // Anna Nagar -> OMR
  {
    id: 13,
    driverName: "Sneha Reddy",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "Anna Nagar",
    destination: "OMR",
    time: "22:30",
    vehicle: "Kia Sonet",
    seats: 2,
    price: "₹150"
  },
  {
    id: 14,
    driverName: "Manoj Bhargav",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "Anna Nagar",
    destination: "OMR",
    time: "22:15",
    vehicle: "Mahindra XUV300",
    seats: 2,
    price: "₹140"
  },

  // Anna Nagar -> Tambaram
  {
    id: 15,
    driverName: "Revathi Parthiban",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "Anna Nagar",
    destination: "Tambaram",
    time: "22:10",
    vehicle: "Hyundai Venue",
    seats: 2,
    price: "₹160"
  },
  {
    id: 16,
    driverName: "Harish Chandran",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "Anna Nagar",
    destination: "Tambaram",
    time: "22:30",
    vehicle: "Maruti Ertiga",
    seats: 4,
    price: "₹150"
  },

  // T. Nagar -> Airport
  {
    id: 17,
    driverName: "Sandhya Lakshmi",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "T. Nagar",
    destination: "Airport",
    time: "22:15",
    vehicle: "Tata Tigor EV",
    seats: 2,
    price: "₹135"
  },
  {
    id: 18,
    driverName: "Vikram Malhotra",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "T. Nagar",
    destination: "Airport",
    time: "22:00",
    vehicle: "Volkswagen Vento",
    seats: 3,
    price: "₹130"
  },

  // Velachery -> OMR
  {
    id: 19,
    driverName: "Pooja Venkat",
    driverGender: "female",
    isWomenOnly: true,
    pickup: "Velachery",
    destination: "OMR",
    time: "21:30",
    vehicle: "Hyundai Grand i10",
    seats: 2,
    price: "₹80"
  },
  {
    id: 20,
    driverName: "Siddharth Raman",
    driverGender: "male",
    isWomenOnly: false,
    pickup: "Velachery",
    destination: "OMR",
    time: "21:45",
    vehicle: "Honda WR-V",
    seats: 2,
    price: "₹85"
  }
];

// Helper to normalize strings (removes spaces, dots, case-insensitive)
const cleanStr = (str) => (str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "");

const Header = () => {
  // Search states
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [womenOnly, setWomenOnly] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Active rides state (allows adding newly offered rides)
  const [ridesList, setRidesList] = useState(initialRidesData);

  // Popup Modal states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerSuccessMsg, setOfferSuccessMsg] = useState("");

  // Offer Empty Seats form state
  const [offerForm, setOfferForm] = useState({
    name: "",
    gender: "Female",
    carName: "",
    vehicleKind: "Car",
    pickup: "",
    destination: "",
    time: "22:00",
    seats: "2",
    price: "100",
    isWomenOnly: true
  });

  // Function to filter rides matching start point and destination point
  const filterRidesList = (pInput, dInput, tInput, isWomen, currentList = ridesList) => {
    const cleanPickup = cleanStr(pInput);
    const cleanDest = cleanStr(dInput);

    return currentList.filter((ride) => {
      // 1. Women-Only check: if checked, only show women driver rides
      if (isWomen && !ride.isWomenOnly) {
        return false;
      }

      // 2. Start point (pickup) match
      if (cleanPickup) {
        const ridePickup = cleanStr(ride.pickup);
        const matchPickup = ridePickup.includes(cleanPickup) || cleanPickup.includes(ridePickup);
        if (!matchPickup) return false;
      }

      // 3. Destination point match
      if (cleanDest) {
        const rideDest = cleanStr(ride.destination);
        const matchDest = rideDest.includes(cleanDest) || cleanDest.includes(rideDest);
        if (!matchDest) return false;
      }

      // 4. Time match (optional: if entered, matches flexible time window)
      if (tInput && tInput.trim()) {
        const [sH, sM] = tInput.split(":").map(Number);
        const [rH, rM] = ride.time.split(":").map(Number);
        if (!isNaN(sH) && !isNaN(rH)) {
          const sTotal = sH * 60 + (sM || 0);
          const rTotal = rH * 60 + (rM || 0);
          const diff1 = Math.abs(sTotal - rTotal);
          const diff2 = Math.abs(((sTotal + 720) % 1440) - rTotal);
          const minDiff = Math.min(diff1, diff2);
          if (minDiff > 90) return false;
        }
      }

      return true;
    });
  };

  // Search logic executed when clicking "Match Shared Ride" or pressing Enter
  const handleSearch = () => {
    setSearched(true);
    const results = filterRidesList(pickup, destination, time, womenOnly);
    setSearchResults(results);
  };

  // When women-only toggle changes
  const handleWomenOnlyChange = (checked) => {
    setWomenOnly(checked);
    if (searched) {
      const results = filterRidesList(pickup, destination, time, checked);
      setSearchResults(results);
    }
  };

  // Submit Offer Empty Seats form
  const handleOfferSubmit = (e) => {
    e.preventDefault();

    const isFemale = offerForm.gender === "Female";
    const newRide = {
      id: Date.now(),
      driverName: offerForm.name.trim(),
      driverGender: offerForm.gender.toLowerCase(),
      isWomenOnly: isFemale && offerForm.isWomenOnly,
      pickup: offerForm.pickup.trim(),
      destination: offerForm.destination.trim(),
      time: offerForm.time || "22:00",
      vehicle: `${offerForm.carName.trim()} (${offerForm.vehicleKind})`,
      seats: Number(offerForm.seats),
      price: offerForm.price ? `₹${offerForm.price}` : "₹100"
    };

    const updatedList = [newRide, ...ridesList];
    setRidesList(updatedList);

    // If search is active, refresh search results with new list
    if (searched) {
      const results = filterRidesList(pickup, destination, time, womenOnly, updatedList);
      setSearchResults(results);
    }

    // Reset and close modal
    setShowOfferModal(false);
    setOfferSuccessMsg(`Ride successfully offered by ${newRide.driverName} from ${newRide.pickup} to ${newRide.destination}!`);
    setTimeout(() => {
      setOfferSuccessMsg("");
    }, 4500);

    // Reset form defaults
    setOfferForm({
      name: "",
      gender: "Female",
      carName: "",
      vehicleKind: "Car",
      pickup: "",
      destination: "",
      time: "22:00",
      seats: "2",
      price: "100",
      isWomenOnly: true
    });
  };

  return (
    <>
    {/* Success Notification for Newly Offered Ride */}
    {offerSuccessMsg && (
      <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400">
        <CheckCircle2 size={20} />
        <span className="text-sm font-semibold">{offerSuccessMsg}</span>
        <button onClick={() => setOfferSuccessMsg("")} className="ml-2 hover:text-emerald-200">
          <X size={18} />
        </button>
      </div>
    )}

    {/* Top Bar */}
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
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                    strokeLinejoin="round" className="lucide lucide-dot preview-icon">
                    <circle cx="12" cy="12" r="1"/></svg>
                  </span>
                  <span className="text-slate-400 text-[12px] font-semibold hidden sm:inline">Mutual Aadhaar/DigiLocker verification with 24x7 India SOS 112 Link</span>
                </div>
            </div>
            <div className="mx-10 flex items-center gap-4">
                <label className="flex items-center cursor-pointer gap-2">
                  <span className="text-[13px] font-medium text-pink-300 hover:text-pink-200">Women-Only Rides</span>
                  <input 
                    type="checkbox" 
                    checked={womenOnly}
                    onChange={(e) => handleWomenOnlyChange(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600 bg-slate-800 border-slate-700 cursor-pointer focus:ring-pink-500"
                  />
                </label>
                <button className="bg-red-600 px-2.5 py-1 text-[11px] font-bold rounded hover:bg-red-500 shadow-lg shadow-red-900/5 animate-pulse">SOS 112</button>
            </div>
        </div>
    </div>

    {/* Header Section */}
    <div className="bg-[#0e233a] p-5 shadow-2xl text-white border-b-2 border-white/10"> 
      <div className="mx-20 flex justify-between">
        <div className="flex">
          <div className="flex items-center text-slate-400">
            <h1 className="text-2xl font-black">VEYORA</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9.5 L12 21.5"/>
            </svg>
          </div>
          <div className="bg-white/10 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border-2 border-white/20 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Feature 4: Shared Ride Option
          </div>
        </div>
        <div className="flex gap-2.5">
          <div 
            onClick={() => setShowOfferModal(true)}
            className="bg-[#2564ebea] hover:bg-blue-600 cursor-pointer flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-xl shadow-2xl transition"
          >
            <CirclePlus size={20} />
            <button type="button">Offer Empty Seats</button>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-xl border-2 border-white/10 flex items-center gap-1.5 text-[14px] font-semibold">
            <ShieldCheck size={20} className="text-emerald-400"/>
            <button>Trust & Safety</button>
          </div>
        </div>
      </div>
    </div>

    {/* Search Section */}
    <section className="mx-15 mt-10 mb-10">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-black/15 pb-10">
        <div className="flex justify-between items-center p-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-black">Share a Ride along Your Night Route</h1>
            <p className="text-sm text-gray-600">Connect with verified commuters travelling your way during late hours. Split fares safely with verified co-passengers,<br /> live GPS tracking, and instant SOS alerts.</p>
          </div>
          <div className="flex gap-3">
            <div 
              onClick={handleSearch}
              className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow flex gap-1.5 items-center cursor-pointer hover:bg-blue-600 transition"
            >
              <Search size={16} />
              <button type="button">Find Matching Ride</button>
            </div>
            <div 
              onClick={() => setShowOfferModal(true)}
              className="bg-black/40 hover:bg-black/60 cursor-pointer px-4 py-2 text-white rounded-xl flex items-center gap-1.5 transition"
            >
              <Car size={20}/>
              <button type="button">Offer Your Empty Seats</button>
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
              <input 
                type="text" 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. KK Nagar" 
                className="bg-gray-200 px-4 py-2 shadow-2xl rounded-lg w-80 border border-black/20 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <MapPinHouse size={15} className="text-violet-600"/>
                <span className="text-slate-500 text-[13px] font-semibold">DESTINATION</span>
              </div>
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. KK Nagar" 
                className="bg-gray-200 px-4 py-2 shadow-2xl rounded-lg w-80 border border-black/20 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-yellow-400"/>
                <span className="text-slate-500 text-[13px] font-semibold">TRAVEL TIME (TONIGHT)</span>
              </div>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. KK Nagar" 
                className="bg-gray-200 px-4 py-2 shadow-2xl rounded-lg w-80 border border-black/20 focus:outline-none"
              />
            </label>

            <div 
              onClick={handleSearch}
              className="bg-blue-500 text-white w-60 px-4 py-2 rounded-xl flex justify-center gap-1.5 items-center mx-5 cursor-pointer hover:bg-blue-600 transition"
            >
              <Compass size={15}/>
              <button type="button">Match Shared Ride</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Results Section */}
    <section className="mx-15 mb-10">
      <div>
        {searched && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-black/15">
            <h2 className="text-2xl font-black mb-4">
              {womenOnly ? "Women-Only Matching Rides" : "Matching Shared Rides"} ({searchResults.length})
            </h2>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((ride) => (
                  <div key={ride.id} className="border border-black/10 rounded-xl p-4 bg-gray-50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-slate-800">{ride.driverName}</h3>
                        {ride.isWomenOnly && (
                          <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                            Women Driver Only
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{ride.vehicle}</p>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-semibold text-emerald-600">Pickup:</span> {ride.pickup}</p>
                        <p><span className="font-semibold text-violet-600">Destination:</span> {ride.destination}</p>
                        <p><span className="font-semibold text-yellow-600">Time:</span> {ride.time}</p>
                        <p><span className="font-semibold text-slate-600">Seats Available:</span> {ride.seats}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center">
                      <span className="font-black text-xl text-slate-900">{ride.price}</span>
                      <button className="bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-blue-600">
                        Book Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No matching rides found for this route. {womenOnly && "Try unchecking Women-Only to see all available rides."}
              </p>
            )}
          </div>
        )}
      </div>
    </section>

    {/* POPUP MODAL: OFFER EMPTY SEATS */}
    {showOfferModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-10 border-2 border-black/15 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-black/15">
            <div className="flex items-center gap-2">
              <Car className="text-blue-600" size={22} />
              <h3 className="font-black text-xl text-slate-900">Offer Empty Seats</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowOfferModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleOfferSubmit} className="mt-4 space-y-4">
            {/* Driver Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={offerForm.name}
                  onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Gender
                </label>
                <select
                  value={offerForm.gender}
                  onChange={(e) => {
                    const g = e.target.value;
                    setOfferForm({
                      ...offerForm,
                      gender: g,
                      isWomenOnly: g === "Female"
                    });
                  }}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Car Name & What Kind of Vehicle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Vechile Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Nexon, Swift"
                  value={offerForm.carName}
                  onChange={(e) => setOfferForm({ ...offerForm, carName: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  What Kind of Vehicle
                </label>
                <select
                  value={offerForm.vehicleKind}
                  onChange={(e) => setOfferForm({ ...offerForm, vehicleKind: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm cursor-pointer"
                >
                  <option value="Car">Car</option>
                  <option value="EV (Electric Vehicle)">EV (Electric Vehicle)</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
            </div>

            {/* Route of Journey: Start Point & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Route (Start Point / Pickup)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KK Nagar"
                  value={offerForm.pickup}
                  onChange={(e) => setOfferForm({ ...offerForm, pickup: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Route (Destination Point)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OMR"
                  value={offerForm.destination}
                  onChange={(e) => setOfferForm({ ...offerForm, destination: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Travel Time & Available Seats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={offerForm.time}
                  onChange={(e) => setOfferForm({ ...offerForm, time: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Available Seats
                </label>
                <select
                  value={offerForm.seats}
                  onChange={(e) => setOfferForm({ ...offerForm, seats: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm cursor-pointer"
                >
                  <option value="1">1 Seat</option>
                  <option value="2">2 Seats</option>
                  <option value="3">3 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Fare (₹)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={offerForm.price}
                  onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                  className="w-full bg-gray-100 focus:bg-white text-slate-800 px-3 py-2 rounded-lg border border-gray-300 focus:outline-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Women-Only Option for Female Drivers */}
            {offerForm.gender === "Female" && (
              <div className="bg-pink-50 border border-pink-200 p-3 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offerForm.isWomenOnly}
                    onChange={(e) => setOfferForm({ ...offerForm, isWomenOnly: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 accent-pink-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-pink-700">
                    Mark as Women-Only Ride (Female passengers only)
                  </span>
                </label>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                Publish Offered Ride
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

export default Header
