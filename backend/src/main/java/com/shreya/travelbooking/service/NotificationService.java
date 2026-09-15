package com.shreya.travelbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.shreya.travelbooking.model.FlightStatus;
import com.shreya.travelbooking.model.Notification;

@Service
public class NotificationService {

    @Autowired
    private FlightStatusService flightStatusService;

    public Notification getNotification(String flightNumber) {

        Notification notification = new Notification();

        FlightStatus flight = flightStatusService.getFlightStatus(flightNumber);

        notification.setFlightNumber(flightNumber);

        String msg = "";

        if (flight.getStatus().equals("On Time")) {

            msg = "Your flight is on time.";

        } else if (flight.getStatus().equals("Boarding")) {

            msg = "Boarding has started.";

        } else if (flight.getStatus().equals("Delayed by 1h")) {

            msg = "Flight is delayed because of bad weather.";

        } else if (flight.getStatus().equals("Departed")) {

            msg = "Flight has departed.";

        } else {

            msg = "Flight has landed.";
        }

        notification.setMessage(msg);
        notification.setUpdateTime(flight.getUpdateTime());

        return notification;
    }

}