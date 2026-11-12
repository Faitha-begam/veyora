
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import FindTransport from './pages/FindTransport'
import SafePlaces from './pages/SafePlaces'
import SharedRide from './pages/SharedRide'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './Sharedrideoption/Header'

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
