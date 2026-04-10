package com.hospital.visitation.service;

import com.hospital.visitation.dto.AppointmentRequest;
import com.hospital.visitation.model.Appointment;
import com.hospital.visitation.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private static final LocalTime VISITING_OPEN  = LocalTime.of(8, 0);
    private static final LocalTime VISITING_CLOSE = LocalTime.of(18, 0);

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public List<Appointment> findAll() {
        return repository.findAll();
    }

    public Optional<Appointment> findById(Long id) {
        return repository.findById(id);
    }

    public Appointment create(AppointmentRequest request) {
        LocalDate visitDate;
        LocalTime visitTime;
        LocalTime departureTime;

        try {
            visitDate = LocalDate.parse(request.getVisitDate());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid visit date format. Use YYYY-MM-DD.");
        }
        try {
            visitTime = LocalTime.parse(request.getVisitTime());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid visit time format. Use HH:MM.");
        }
        try {
            departureTime = LocalTime.parse(request.getDepartureTime());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid departure time format. Use HH:MM.");
        }

        if (visitTime.isBefore(VISITING_OPEN)) {
            throw new IllegalArgumentException("Visit time must be 08:00 or later.");
        }
        if (visitTime.isAfter(VISITING_CLOSE)) {
            throw new IllegalArgumentException("Visit time must be 18:00 or earlier.");
        }
        if (departureTime.isAfter(VISITING_CLOSE)) {
            throw new IllegalArgumentException("Departure time must be 18:00 or earlier.");
        }
        if (!visitTime.isBefore(departureTime)) {
            throw new IllegalArgumentException("Visit time must be before departure time.");
        }

        Appointment appointment = new Appointment();
        appointment.setVisitorName(request.getVisitorName().trim());
        appointment.setPatientName(request.getPatientName().trim());
        appointment.setVisitDate(visitDate);
        appointment.setVisitTime(visitTime);
        appointment.setDepartureTime(departureTime);

        return repository.save(appointment);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Appointment not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
