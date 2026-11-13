import { useState } from "react"

const CardsDesign = ({place}) => {
 const[showReason,setShowReason]=useState(false)
 const handleReason = () => {
    setShowReason(!showReason);
};
const handleDirections = () => {
    alert("Directions feature will be available soon");
};
  return (
 

    <div className="safe-card">

   


      <h2 className="place-name">{place.name}</h2>

       <p>
        <strong className="label">Category:</strong>
        {place.category}
      </p>

       <span className={`safety ${place.safety.toLowerCase()}`}>
        {place.safety} Safety
      </span>

       <p>
        <strong className="label">Distance:</strong>
        {place.distance}
      </p>

      <p>
        <strong className="label">Status:</strong>
        <span className="status">
          {place.status}
        </span>
      </p>

      <p>
        <strong className="label">Rating:</strong>
        {place.rating}
      </p>

      <div className="card-buttons">

<button  className="reason-btn" onClick={handleReason}>
    {showReason ? "Hide Reason" : "Why Safe?"}
</button>

<button className="direction-btn" onClick={handleDirections}>
    Get Directions
</button>

</div>


{showReason && (
    <p className="reason">
        {place.reason}
    </p>
)}

      

    </div>
  )
}

export default CardsDesign
  