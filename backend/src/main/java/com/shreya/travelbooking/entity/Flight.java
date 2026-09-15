package com.shreya.travelbooking.entity;

import jakarta.persistence.*;

@Entity
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;
    private String airline;
    private String departure;
    private String arrival;
    private String status;
    private String delayReason;
    private String estimatedArrivalTime;

    public Flight() {
        this.status = "SCHEDULED";
    }

    public Long getId() {
        return id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getAirline() {
        return airline;
    }

    public String getDeparture() {
        return departure;
    }

    public String getArrival() {
        return arrival;
    }

    public String getStatus() {
        return status;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public String getEstimatedArrivalTime() {
        return estimatedArrivalTime;
    }


    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public void setEstimatedArrivalTime(String estimatedArrivalTime) {
        this.estimatedArrivalTime = estimatedArrivalTime;
    }
}