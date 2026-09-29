import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SimCards from './pages/SimCards'
import Customers from './pages/Customers'
import TopUps from './pages/TopUps'
import SimCardTopUps from './pages/SimCardTopUps'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/sim-cards" element={<SimCards />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/top-ups" element={<TopUps />} />
        <Route path="/admin/sim-cards/:id/top-ups" element={<SimCardTopUps />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
