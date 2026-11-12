import SearchBar from './womenSafety/SearchBar'
import  "./App.css"
const App = () => {
  const location = useLocation()

  return (
    <>
      {location.pathname !== '/register' && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/find-transport"
          element={ <><FindTransport /></>}
        />
        <Route path="/safe-places" element={<SafePlaces />} />
        <Route path="/shared-rides" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
