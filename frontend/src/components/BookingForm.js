import React, { useState } from 'react';
import './BookingForm.css';

const API_URL = 'http://localhost:8080/api/appointments';

const INITIAL_FORM = {
  visitorName: '',
  patientName: '',
  visitDate: '',
  visitTime: '',
  departureTime: '',
};

const TIME_MIN = '08:00';
const TIME_MAX = '18:00';

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function validateForm(fields) {
  const errors = {};

  if (!fields.visitorName.trim()) {
    errors.visitorName = 'Visitor name is required.';
  }

  if (!fields.patientName.trim()) {
    errors.patientName = 'Patient name is required.';
  }

  if (!fields.visitDate) {
    errors.visitDate = 'Visit date is required.';
  } else if (isNaN(Date.parse(fields.visitDate))) {
    errors.visitDate = 'Visit date is not valid.';
  }

  if (!fields.visitTime) {
    errors.visitTime = 'Visit time is required.';
  } else if (
    timeToMinutes(fields.visitTime) < timeToMinutes(TIME_MIN) ||
    timeToMinutes(fields.visitTime) > timeToMinutes(TIME_MAX)
  ) {
    errors.visitTime = 'Visit time must be between 08:00 and 18:00.';
  }

  if (!fields.departureTime) {
    errors.departureTime = 'Departure time is required.';
  } else if (
    timeToMinutes(fields.departureTime) < timeToMinutes(TIME_MIN) ||
    timeToMinutes(fields.departureTime) > timeToMinutes(TIME_MAX)
  ) {
    errors.departureTime = 'Departure time must be between 08:00 and 18:00.';
  }

  if (
    !errors.visitTime &&
    !errors.departureTime &&
    fields.visitTime &&
    fields.departureTime &&
    timeToMinutes(fields.visitTime) >= timeToMinutes(fields.departureTime)
  ) {
    errors.departureTime = 'Departure time must be after visit time.';
  }

  return errors;
}

function BookingForm({ onAppointmentBooked }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user edits
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setApiError('');

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: form.visitorName.trim(),
          patientName: form.patientName.trim(),
          visitDate: form.visitDate,
          visitTime: form.visitTime,
          departureTime: form.departureTime,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Appointment booked successfully!');
        setForm(INITIAL_FORM);
        setErrors({});
        onAppointmentBooked();
      } else {
        let message = `Error ${response.status}: Could not book appointment.`;
        try {
          const data = await response.json();
          if (data && data.message) message = data.message;
          else if (data && data.error) message = data.error;
        } catch (_) {
          // keep default message
        }
        setApiError(message);
      }
    } catch (err) {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-card">
      <h2 className="booking-title">📋 Book a Visit</h2>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {apiError && (
        <div className="alert alert-error" role="alert">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="visitorName">Visitor Name</label>
          <input
            id="visitorName"
            type="text"
            name="visitorName"
            value={form.visitorName}
            onChange={handleChange}
            placeholder="Enter visitor's full name"
            className={errors.visitorName ? 'input-error' : ''}
          />
          {errors.visitorName && (
            <span className="field-error">{errors.visitorName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="patientName">Patient Name</label>
          <input
            id="patientName"
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            placeholder="Enter patient's full name"
            className={errors.patientName ? 'input-error' : ''}
          />
          {errors.patientName && (
            <span className="field-error">{errors.patientName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="visitDate">Visit Date</label>
          <input
            id="visitDate"
            type="date"
            name="visitDate"
            value={form.visitDate}
            onChange={handleChange}
            className={errors.visitDate ? 'input-error' : ''}
          />
          {errors.visitDate && (
            <span className="field-error">{errors.visitDate}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="visitTime">Visit Time</label>
            <input
              id="visitTime"
              type="time"
              name="visitTime"
              value={form.visitTime}
              onChange={handleChange}
              min={TIME_MIN}
              max={TIME_MAX}
              className={errors.visitTime ? 'input-error' : ''}
            />
            {errors.visitTime && (
              <span className="field-error">{errors.visitTime}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="departureTime">Departure Time</label>
            <input
              id="departureTime"
              type="time"
              name="departureTime"
              value={form.departureTime}
              onChange={handleChange}
              min={TIME_MIN}
              max={TIME_MAX}
              className={errors.departureTime ? 'input-error' : ''}
            />
            {errors.departureTime && (
              <span className="field-error">{errors.departureTime}</span>
            )}
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Booking…' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
