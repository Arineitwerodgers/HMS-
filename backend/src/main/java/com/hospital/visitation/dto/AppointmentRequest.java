package com.hospital.visitation.dto;

import jakarta.validation.constraints.NotBlank;

public class AppointmentRequest {

    @NotBlank(message = "Visitor name is required")
    private String visitorName;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Visit date is required")
    private String visitDate;

    @NotBlank(message = "Visit time is required")
    private String visitTime;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    public AppointmentRequest() {}

    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getVisitDate() { return visitDate; }
    public void setVisitDate(String visitDate) { this.visitDate = visitDate; }

    public String getVisitTime() { return visitTime; }
    public void setVisitTime(String visitTime) { this.visitTime = visitTime; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
}
