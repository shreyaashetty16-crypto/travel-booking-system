package com.shreya.travelbooking.model;

public class UserPreference {

    private String userName;
    private String preferredSeat;
    private String preferredRoom;
    private String preferredDestination;

    public UserPreference() {
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPreferredSeat() {
        return preferredSeat;
    }

    public void setPreferredSeat(String preferredSeat) {
        this.preferredSeat = preferredSeat;
    }

    public String getPreferredRoom() {
        return preferredRoom;
    }

    public void setPreferredRoom(String preferredRoom) {
        this.preferredRoom = preferredRoom;
    }

    public String getPreferredDestination() {
        return preferredDestination;
    }

    public void setPreferredDestination(String preferredDestination) {
        this.preferredDestination = preferredDestination;
    }
}