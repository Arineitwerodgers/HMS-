import React, { useState, useEffect, useCallback } from 'react';
import './AppointmentList.css';

const API_URL = 'http://localhost:8080/api/appointments';

function AppointmentList({ refreshKey }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}.`);
      }
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    setDeletingId(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } else {
        alert(`Could not delete appointment (status ${response.status}).`);
      }
    } catch (err) {
      alert('Network error. Could not delete appointment.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="list-card">
      <div className="list-header">
        <h2 className="list-title">📅 Appointments</h2>
        <button className="btn-refresh" onClick={fetchAppointments} title="Refresh list">
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div className="list-status">
          <span className="spinner" aria-label="Loading" /> Loading appointments…
        </div>
      )}

      {!loading && fetchError && (
        <div className="list-status list-error">{fetchError}</div>
      )}

      {!loading && !fetchError && appointments.length === 0 && (
        <div className="list-status list-empty">No appointments found.</div>
      )}

      {!loading && !fetchError && appointments.length > 0 && (
        <div className="table-wrapper">
          <table className="appt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Visitor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Visit</th>
                <th>Departure</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id}>
                  <td>{index + 1}</td>
                  <td>{appt.visitorName}</td>
                  <td>{appt.patientName}</td>
                  <td>{appt.visitDate}</td>
                  <td>{appt.visitTime}</td>
                  <td>{appt.departureTime}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(appt.id)}
                      disabled={deletingId === appt.id}
                      aria-label={`Delete appointment for ${appt.visitorName}`}
                    >
                      {deletingId === appt.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
