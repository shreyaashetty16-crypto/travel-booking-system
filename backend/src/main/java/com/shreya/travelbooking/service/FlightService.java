package com.shreya.travelbooking.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.Flight;
import com.shreya.travelbooking.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;


    public Flight addFlight(Flight flight) {
        return flightRepository.save(flight);
    }


    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }


    public Flight getFlightById(Long id) {

        Optional<Flight> flight = flightRepository.findById(id);

        return flight.orElse(null);
    }


    public String deleteFlight(Long id) {

        flightRepository.deleteById(id);

        return "Flight deleted successfully";
    }
}