package com.shreya.travelbooking.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.RefundStatus;

@Service
public class RefundStatusService {

    Map<String, RefundStatus> map = new HashMap<>();

    public RefundStatus getRefundStatus(String flightNumber) {

        if (map.containsKey(flightNumber)) {
            return map.get(flightNumber);
        }

        RefundStatus status = new RefundStatus();

        status.setFlightNumber(flightNumber);
        status.setRefundStatus("Pending");
        status.setExpectedTime("3-5 Business Days");

        map.put(flightNumber, status);

        return status;
    }

    public RefundStatus updateRefundStatus(String flightNumber, String statusText) {

        RefundStatus status;

        if (map.containsKey(flightNumber)) {
            status = map.get(flightNumber);
        } else {
            status = new RefundStatus();
            status.setFlightNumber(flightNumber);
        }

        status.setRefundStatus(statusText);
        status.setExpectedTime("Updated");

        map.put(flightNumber, status);

        return status;
    }

}