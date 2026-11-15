import { useState } from "react";
import WomenSafetyNavbar from "./WomenSafetyNavbar";
import SearchBar from "./SearchBar";

const SafePlacesPage = () => {

  const [womenSafety, setWomenSafety] = useState(false);

  return (
    <>
      <WomenSafetyNavbar
        womenSafety={womenSafety}
        setWomenSafety={setWomenSafety}
      />

      <SearchBar
        womenSafety={womenSafety}
      />
    </>
  );
};

export default SafePlacesPage;