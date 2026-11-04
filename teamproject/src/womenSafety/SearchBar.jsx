import { useState } from "react"
import safePlacesByArea from "./SafePlaces"
const SearchBar = () => {
    const[search,setSearch]=useState("")
        const[searched,setSearched]=useState(false)

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
     
    
  return (
    <>
    <label htmlFor="location">Search Location: </label>

<select
  id="location"
  value={search}
  onChange={handleSearch}
>
  <option value="">Select an Area </option>

  <option value="Ashok Pillar">Ashok Pillar</option>

  <option value="Anna Nagar">Anna Nagar</option>

  <option value="Koyambedu">Koyambedu</option>

  <option value="Guindy">Guindy</option>
</select>
    <button onClick={handleFindPlaces}>Find Safe Places</button>
     { searched && places.length === 0 && search !== "" && (
  <p>No safe waiting places found for "{search}".</p>
)}
    {places.map((e)=>(
        <div key={e.id}>
            <h3>Name: {e.name}</h3>
            <h3>Category: {e.category}</h3>
            <h3>Safety: {e.safety}</h3>
            <h3>Distance: {e.distance}</h3>
            <h3>Status: {e.status   }</h3>
            <h3>rating: {e.rating}</h3>
            <h3>reason: {e.reason}</h3>
           
  
        </div>
    ))}
    
    </>
  )
}

export default SearchBar
