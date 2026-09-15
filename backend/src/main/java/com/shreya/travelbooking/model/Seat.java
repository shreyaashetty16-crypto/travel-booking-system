package com.shreya.travelbooking.model;

public class Seat {

    private String seatNumber;
    private boolean available;
    private boolean premium;
    private double price;

    public Seat() {

    }

    public Seat(String seatNumber, boolean available, boolean premium, double price) {
        this.seatNumber = seatNumber;
        this.available = available;
        this.premium = premium;
        this.price = price;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public boolean isPremium() {
        return premium;
    }

    public void setPremium(boolean premium) {
        this.premium = premium;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}