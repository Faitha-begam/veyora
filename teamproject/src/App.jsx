
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import FindTransport from './pages/FindTransport'
import Login from './pages/Login'
import Register from './pages/Register'

import Rideoption from './Sharedrideoption/Rideoption'

import './App.css'
import CardsDesign from './womenSafety/CardsDesign'

const App = () => {
  const location = useLocation()

  return (
    <>
      {location.pathname !== '/register' && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/find-transport"
          element={<FindTransport />}
        />

        <Route
          path="/safe-places"
          element={<CardsDesign />}
        />

        <Route
          path="/shared-rides"
          element={<Rideoption />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
