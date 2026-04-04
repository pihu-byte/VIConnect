import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import VitConnectRegister from './pages/Register'
import VitConnectLanding from './pages/Landing'
import VitConnectLogin from './pages/Login'
import VitConnectDashboard from './pages/Dashboard'
import PostRide from './pages/PostRide'
import InboxPage from './pages/Inbox'
import Profile from './pages/Profile'
import CreateTeam from './pages/CreateTeam'
import BrowseTeams from './pages/BrowseTeams'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VitConnectLanding />} />
        <Route path="/register" element={<VitConnectRegister />} />
        <Route path="/login" element={<VitConnectLogin />} />
        <Route path="/dashboard" element={<VitConnectDashboard />} />
        <Route path="/post-ride" element={<PostRide />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/browse-teams" element={<BrowseTeams />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
