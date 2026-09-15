package com.shreya.travelbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.CancellationReason;

@Service
public class CancellationReasonService {

    public CancellationReason getReasons() {

        List<String> list = new ArrayList<>();

        list.add("Personal");
        list.add("Medical");
        list.add("Flight Cancelled");
        list.add("Weather");
        list.add("Other");

        CancellationReason reason = new CancellationReason();

        reason.setReasons(list);

        return reason;
    }

}