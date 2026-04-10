import React, { useState } from 'react';
import './App.css';
import VisitingHours from './components/VisitingHours';
import BookingForm from './components/BookingForm';
import AppointmentList from './components/AppointmentList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentBooked = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <span className="header-icon">🏥</span>
          <div>
            <h1 className="header-title">City General Hospital</h1>
            <p className="header-subtitle">Visitation Control System</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <VisitingHours />
        <div className="content-grid">
          <BookingForm onAppointmentBooked={handleAppointmentBooked} />
          <AppointmentList refreshKey={refreshKey} />
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} City General Hospital. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
