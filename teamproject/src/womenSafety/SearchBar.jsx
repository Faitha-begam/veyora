import { useState } from "react"
import safePlacesByArea from "./SafePlaces"
import CardsDesign from "./CardsDesign";
const SearchBar = () => {
        const[search,setSearch]=useState("")
        const[searched,setSearched]=useState(false)
        const [safetyFilter, setSafetyFilter] = useState("All");

    const[places,setPlaces]=useState([])
    const handleSearch=(e)=>{
        setSearch(e.target.value)
    }
    const handleFindPlaces=()=>{
        setSearched(true)
        const key = Object.keys(safePlacesByArea).find(
    (area) => area.toLowerCase() === search.trim().toLowerCase()
  );

  if (key) {
    setPlaces(safePlacesByArea[key]);
  } else {
    setPlaces([]);
  }

    }
    const handleSafetyFilter = (level) => {
    setSafetyFilter(level);
};
    const filteredPlaces = safetyFilter==="All"
    ? places:places.filter((place) => place.safety === safetyFilter)
    
     
    
  return (
    <>
    <div className="search-section">

  <label htmlFor="location">
    Search Location:
  </label>

  <select
  className="location-select"
    id="location"
    value={search}
    onChange={handleSearch}
  >
    <option value="">Select an Area</option>
    <option value="Ashok Pillar">Ashok Pillar</option>
    <option value="Anna Nagar">Anna Nagar</option>
    <option value="Koyambedu">Koyambedu</option>
    <option value="Guindy">Guindy</option>
  </select>
   
    <button className="btn" onClick={handleFindPlaces}>Find Safe Places</button>
     { searched && places.length === 0 && search !== "" && (
  <p>No safe waiting places found for "{search}".</p>
)}
</div>
 <div className="safety-filter">


<p className="selected-filter">
  Selected Filter: {safetyFilter}
</p>

<button className={safetyFilter === "All" ? "active-filter" : ""}
onClick={()=>handleSafetyFilter("All")}
>
All
</button>


<button  className={safetyFilter === "High" ? "active-filter" : ""}
onClick={()=>handleSafetyFilter("High")}
>
High Safety
</button>


<button className={safetyFilter === "Medium" ? "active-filter" : ""}
onClick={()=>handleSafetyFilter("Medium")}
>
Medium Safety
</button>


<button  className={safetyFilter === "Public" ? "active-filter" : ""}
onClick={()=>handleSafetyFilter("Public")}
>
Public Places
</button>

</div>
  <div className="cards-container">
  {filteredPlaces.map((place)=>(
    <CardsDesign
        key={place.id}
        place={place}
    />
  ))}
</div>
  
    
    </>
  )
}

export default SearchBar
