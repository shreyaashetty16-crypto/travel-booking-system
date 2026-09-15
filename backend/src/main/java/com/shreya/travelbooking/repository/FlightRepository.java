package com.shreya.travelbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shreya.travelbooking.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {

}