package com.shreya.travelbooking.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.Cancellation;

@Service
public class CancellationService {

    Map<String, Cancellation> map = new HashMap<>();

    public Cancellation cancelBooking(String flightNumber,
                                      double bookingAmount,
                                      String reason,
                                      boolean cancelledWithin24Hours) {

        Cancellation cancel = new Cancellation();

        cancel.setFlightNumber(flightNumber);
        cancel.setBookingAmount(bookingAmount);
        cancel.setReason(reason);
        cancel.setCancelledWithin24Hours(cancelledWithin24Hours);

        int percentage = 25;

        if (cancelledWithin24Hours) {

            percentage = 100;

        } else if (reason.equalsIgnoreCase("Medical")) {

            percentage = 100;

        } else if (reason.equalsIgnoreCase("Flight Cancelled")) {

            percentage = 100;

        } else if (reason.equalsIgnoreCase("Personal")) {

            percentage = 50;

        }

        double refund = bookingAmount * percentage / 100;

        cancel.setRefundPercentage(percentage);
        cancel.setRefundAmount(refund);
        cancel.setRefundStatus("Pending");

        map.put(flightNumber, cancel);

        return cancel;
    }

    public Cancellation getRefundStatus(String flightNumber) {

        return map.get(flightNumber);
    }

    public Map<String, Cancellation> getAllCancelledBookings() {

        return map;
    }

}