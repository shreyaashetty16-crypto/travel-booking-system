package com.shreya.travelbooking.model;

public class PriceFreeze {

    private String flightNumber;
    private double frozenPrice;
    private long freezeTime;

    public PriceFreeze() {

    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public double getFrozenPrice() {
        return frozenPrice;
    }

    public void setFrozenPrice(double frozenPrice) {
        this.frozenPrice = frozenPrice;
    }

    public long getFreezeTime() {
        return freezeTime;
    }

    public void setFreezeTime(long freezeTime) {
        this.freezeTime = freezeTime;
    }
}
