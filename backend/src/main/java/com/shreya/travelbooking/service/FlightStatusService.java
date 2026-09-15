package com.shreya.travelbooking.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Service;
import com.shreya.travelbooking.model.FlightStatus;

@Service
public class FlightStatusService {

    Random random = new Random();

    String[] statusList = {
            "On Time",
            "Boarding",
            "Delayed by 1h",
            "Departed",
            "Landed"
    };

    String[] reasonList = {
            "No Delay",
            "Bad Weather",
            "Technical Problem",
            "Air Traffic",
            "Late Arrival"
    };

    public FlightStatus getFlightStatus(String flightNumber) {

        FlightStatus status = new FlightStatus();

        status.setFlightNumber(flightNumber);

        int statusIndex = random.nextInt(statusList.length);
        status.setStatus(statusList[statusIndex]);

        int reasonIndex = random.nextInt(reasonList.length);
        status.setReason(reasonList[reasonIndex]);

        LocalTime arrivalTime = LocalTime.now().plusMinutes(45);

        if (status.getStatus().equals("Delayed by 1h")) {
        arrivalTime = arrivalTime.plusHours(1);
         }

        status.setArrivalTime(arrivalTime.toString());
        status.setUpdateTime(LocalTime.now().toString());

        return status;
    }

    public List<FlightStatus> getAllFlightStatus() {

        List<FlightStatus> flightList = new ArrayList<>();

        flightList.add(getFlightStatus("AI101"));
        flightList.add(getFlightStatus("6E202"));
        flightList.add(getFlightStatus("UK303"));
        flightList.add(getFlightStatus("SG404"));

        return flightList;
    }
}