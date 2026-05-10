import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import Budget from './pages/Budget';
import Checklist from './pages/Checklist';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';
import TripNotes from './pages/TripNotes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/trip/:id/build" element={<ItineraryBuilder />} />
            <Route path="/trip/:id/view" element={<ItineraryView />} />
            <Route path="/trip/:id/cities" element={<CitySearch />} />
            <Route path="/trip/:id/stop/:stopId/activities" element={<ActivitySearch />} />
            <Route path="/trip/:id/budget" element={<Budget />} />
            <Route path="/trip/:id/checklist" element={<Checklist />} />
            <Route path="/shared/:tripId" element={<SharedItinerary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trip/:id/notes" element={<TripNotes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
