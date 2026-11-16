import { useEffect, useState } from "react";

const WomenSafetyNavbar = ({womenSafety,setWomenSafety}) => {
  const [showSOS, setShowSOS] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({
  name: "",
  phone: ""
});
  const [success, setSuccess] = useState("");
  
  const [savedContact, setSavedContact] = useState(null);
  useEffect(() => {

  const storedContact = localStorage.getItem("trustedContact");

  if(storedContact){
    setSavedContact(JSON.parse(storedContact));
  }

}, []);
  
  const [error, setError] = useState("");

    const handleContactChange = (e) => {
  setContact({
    ...contact,
    [e.target.name]: e.target.value
  });
};
  const handleSaveContact = () => {

  if(contact.name.trim() === ""){
    setError("Please enter contact name");
    return;
  }




  if(!/^[0-9]+$/.test(contact.phone)){
    setError("Phone number should contain only digits");
    return;
  }


  if(contact.phone.length !== 10){
    setError("Phone number must be exactly 10 digits");
    return;
  }


  localStorage.setItem(
    "trustedContact",
    JSON.stringify(contact)
  );
  setSavedContact(contact);
  

  setError("");
  setSuccess("Contact saved successfully");
  setShowContact(false);
  setTimeout(() => {
  setSuccess("");
}, 3000);

};

  const handleRemoveContact = () => {

  localStorage.removeItem("trustedContact");

  setSavedContact(null);

};
  return (
    <>

      
      {/* Top Safety Bar */}
      <div className="
        bg-[#142B45]
        text-white
        px-6
        py-3
        flex
        justify-between
        items-center
        border-b
        border-slate-600
      ">

        <div className="
          flex
          items-center
          gap-3
        ">
          <span className="
            border
            border-[#14B8A6]
            text-[#14B8A6]
            px-4
            py-1
            rounded-full
            text-sm
          ">
            Night Safety Network Active
          </span>

         {
  womenSafety && (
    <span className="text-[#14B8A6] font-semibold ml-3">
      Women Safety Enabled
    </span>
  )
}

  
        </div>


        <div className="
          flex
          items-center
          gap-4
        ">

          
              <button
        onClick={() => setShowSOS(true)}
        className="
          bg-red-600
          hover:bg-red-700
          px-4
          py-2
          rounded-xl
          font-semibold
          text-[14px]
        "
      >

        SOS 112

      </button>


        </div>

      </div>


      {/* Main Navbar */}
      <div className="
        bg-[#142B45]
        px-5
        py-6
        flex
        justify-between
        items-center
      ">


        <div className="
          flex
          items-center
          gap-4
        ">

          

          


         


          <div className="
        bg-white/10
        text-slate-300
        text-[11px]
        px-3
        py-1
        rounded-full
        border-2
        border-white/20
        font-semibold
        flex
        items-center
        gap-2
      ">

        <span className="
          w-2
          h-2
          bg-indigo-500
          rounded-full
        "></span>

        Feature 3: Women Safety

      </div>


<label className="
  flex
  items-center
  gap-2
  text-white
">

<input
  type="checkbox"
  checked={womenSafety}
  onChange={() => setWomenSafety(!womenSafety)}
  className="
    w-5
    h-5
    accent-[#14B8A6]
  "
/>

Women Safety

</label>

        </div>



        <div className="
          flex
          gap-4
        ">

          <div>

<button
  onClick={() => setShowContact(true)}
  className="
    bg-[#2563EB]
    text-white
    px-4
    py-2
    rounded-xl
  "
>
  Trusted Contact
</button>
{success && (
  <p className="
    text-[#14B8A6]
    text-sm
    mt-2
  ">
    ✓ {success}
  </p>
)}






</div>
{savedContact && (
  <div className="
    text-white
    text-sm
    mt-2
  ">
    ✓ {savedContact.name}

    <button
      onClick={handleRemoveContact}
      className="
        text-red-400
        ml-3
      "
    >
      Remove
    </button>

  </div>
)}


          <button
  onClick={() => setShowSafety(true)}
  className="
    border
    border-[#14B8A6]
    text-white
    px-4
    py-2
    rounded-xl
  "
><span className="text-emerald-400">
          🛡
        </span>
  Trust & Safety
</button>


        </div>



      </div>
      {showSOS && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-96">

      <h2 className="text-xl font-bold text-red-600">
        Emergency Assistance
      </h2>

      <p className="mt-3 text-gray-700">
        Do you want to contact India's Emergency Helpline (112)?
      </p>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowSOS(false)}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => alert("Calling 112...")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Call 112
        </button>

      </div>

    </div>

  </div>
)}

          {showSafety && (
  <div className="
    fixed
    inset-0
    bg-black/50
    flex
    items-center
    justify-center
  ">

    <div className="
      bg-white
      w-96
      rounded-xl
      p-6
    ">

      <h2 className="
        text-xl
        font-bold
        text-[#142B45]
      ">
        Trust & Safety
      </h2>


      <div className="mt-4 space-y-3 text-gray-700">

        <div>
          <h3 className="font-semibold">
            Emergency Guidelines
          </h3>
          <p>
            Contact 112 immediately during emergencies.
          </p>
        </div>


        <div>
          <h3 className="font-semibold">
            Safe Travel Tips
          </h3>
          <p>
            Prefer well-lit areas and verified safe locations.
          </p>
        </div>


        <div>
          <h3 className="font-semibold">
            Women Safety Mode
          </h3>
          <p>
            Shows highly rated safe places during night travel.
          </p>
        </div>

      </div>


      <button
        onClick={() => setShowSafety(false)}
        className="
          mt-5
          bg-[#2563EB]
          text-white
          px-4
          py-2
          rounded-lg
        "
      >
        Close
      </button>

    </div>

  </div>
)}

    {showContact && (
  <div className="
    fixed
    inset-0
    bg-black/50
    flex
    items-center
    justify-center
  ">

    <div className="
      bg-white
      p-6
      rounded-xl
      w-96
    ">

      <h2 className="
        text-xl
        font-bold
        text-[#142B45]
      ">
        Trusted Contact
      </h2>


      <input
        type="text"
        name="name"
        placeholder="Contact Name"
        value={contact.name}
        onChange={handleContactChange}
        className="
          border
          w-full
          mt-4
          p-2
          rounded
        "
      />


      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={contact.phone}
        onChange={handleContactChange}
        className="
          border
          w-full
          mt-3
          p-2
          rounded
        "
      />
      {error && (
  <p className="text-red-600 mt-2 text-sm">
    {error}
  </p>
)}


      <div className="
        flex
        justify-end
        gap-3
        mt-5
      ">

        <button
          onClick={() => setShowContact(false)}
          className="
            border
            px-4
            py-2
            rounded
          "
        >
          Cancel
        </button>


       <button
  onClick={handleSaveContact}
  className="
    bg-[#2563EB]
    text-white
    px-4
    py-2
    rounded
  "
>
  Save Contact
</button>

      </div>

    </div>

  </div>
)}
   

    </>
  )
}

export default WomenSafetyNavbar