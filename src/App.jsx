import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import VitConnectRegister from './pages/Register'
import VitConnectLanding from './pages/Landing'
import VitConnectLogin from './pages/Login'
import VitConnectDashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VitConnectLanding />} />
        <Route path="/register" element={<VitConnectRegister />} />
        <Route path="/login" element={<VitConnectLogin />} />
        <Route path="/dashboard" element={<VitConnectDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
