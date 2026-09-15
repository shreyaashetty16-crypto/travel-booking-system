package com.shreya.travelbooking.model;

public class Room {

    private String roomNumber;
    private String roomType;
    private boolean available;
    private double price;

    public Room() {

    }

    public Room(String roomNumber, String roomType, boolean available, double price) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.available = available;
        this.price = price;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}