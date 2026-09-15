package com.shreya.travelbooking.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.shreya.travelbooking.model.PriceDetails;
import com.shreya.travelbooking.model.PriceHistory;

@Service
public class PricingService {

    public PriceDetails getPrice(String flightNumber) {

        PriceDetails price = new PriceDetails();

        price.setFlightNumber(flightNumber);
        price.setOriginalPrice(5000);

        double currentPrice = 5000;
        String season = "Normal";
        String status = "Normal Price";
        String reason = "Regular Pricing";
        String lastUpdated = "Updated Just Now";

        if (flightNumber.equals("AI101")) {

            currentPrice = 6000;
            season = "Peak";
            status = "Price Increased";
            reason = "High Travel Demand";

        } else if (flightNumber.equals("AI102")) {

            currentPrice = 5000;
            season = "Normal";
            status = "Normal Price";
            reason = "Regular Pricing";

        } else if (flightNumber.equals("AI103")) {

            currentPrice = 7000;
            season = "Holiday";
            status = "Price Increased";
            reason = "Holiday Season";

        }

        price.setCurrentPrice(currentPrice);
        price.setSeason(season);
        price.setPriceStatus(status);
        price.setReason(reason);
        price.setLastUpdated(lastUpdated);

        return price;
    }

    public PriceHistory getPriceHistory(String flightNumber) {

        PriceHistory history = new PriceHistory();

        history.setFlightNumber(flightNumber);

        List<Double> list = new ArrayList<>();

        list.add(5000.0);
        list.add(5200.0);
        list.add(5500.0);
        list.add(6000.0);

        history.setPriceHistory(list);

        return history;
    }

}