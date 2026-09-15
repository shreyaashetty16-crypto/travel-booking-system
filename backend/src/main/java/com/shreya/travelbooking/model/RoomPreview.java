package com.shreya.travelbooking.model;

public class RoomPreview {

    private String roomNumber;
    private String roomType;
    private String imageUrl;
    private String preview3D;

    public RoomPreview() {

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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPreview3D() {
        return preview3D;
    }

    public void setPreview3D(String preview3D) {
        this.preview3D = preview3D;
    }
}
