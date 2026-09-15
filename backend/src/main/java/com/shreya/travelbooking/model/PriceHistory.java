package com.shreya.travelbooking.model;

import java.util.List;

public class PriceHistory {

    private String flightNumber;
    private List<Double> priceHistory;

    public PriceHistory() {

    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public List<Double> getPriceHistory() {
        return priceHistory;
    }

    public void setPriceHistory(List<Double> priceHistory) {
        this.priceHistory = priceHistory;
    }

}