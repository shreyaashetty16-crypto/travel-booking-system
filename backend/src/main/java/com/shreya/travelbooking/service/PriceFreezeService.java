package com.shreya.travelbooking.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.shreya.travelbooking.model.PriceFreeze;

@Service
public class PriceFreezeService {

    Map<String, PriceFreeze> map = new HashMap<>();

    public PriceFreeze freezePrice(String flightNumber, double price) {

        PriceFreeze freeze = new PriceFreeze();

        freeze.setFlightNumber(flightNumber);
        freeze.setFrozenPrice(price);
        freeze.setFreezeTime(System.currentTimeMillis());

        map.put(flightNumber, freeze);

        return freeze;
    }

    public PriceFreeze getFrozenPrice(String flightNumber) {

        return map.get(flightNumber);
    }
}
