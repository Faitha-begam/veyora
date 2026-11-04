function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 5px lightgray"
    }}>

      <h2 style={{ color: "#2563eb" }}>Veyora</h2>

      <div style={{ display: "flex", gap: "25px" }}>
        <a href="/" style={{ textDecoration: "none", color: "black" }}>Home</a>
        <a href="#about" style={{ textDecoration: "none", color: "black" }}>About</a>
        <a href="#services" style={{ textDecoration: "none", color: "black" }}>Services</a>
        <a href="#contact" style={{ textDecoration: "none", color: "black" }}>Contact</a>
      </div>

      <button style={{
        backgroundColor: "#2563eb",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        Login
      </button>

    </nav>
  );
}

export default Navbar;