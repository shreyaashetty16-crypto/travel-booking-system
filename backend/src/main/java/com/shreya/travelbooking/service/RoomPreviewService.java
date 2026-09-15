package com.shreya.travelbooking.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.RoomPreview;

@Service
public class RoomPreviewService {

    private Map<String, RoomPreview> roomMap = new HashMap<>();

    public RoomPreviewService() {

        RoomPreview room1 = new RoomPreview();
        room1.setRoomNumber("101");
        room1.setRoomType("Standard");
        room1.setImageUrl("https://example.com/images/room101.jpg");
        room1.setPreview3D("https://example.com/3d/room101");

        RoomPreview room2 = new RoomPreview();
        room2.setRoomNumber("102");
        room2.setRoomType("Deluxe");
        room2.setImageUrl("https://example.com/images/room102.jpg");
        room2.setPreview3D("https://example.com/3d/room102");

        RoomPreview room3 = new RoomPreview();
        room3.setRoomNumber("103");
        room3.setRoomType("Suite");
        room3.setImageUrl("https://example.com/images/room103.jpg");
        room3.setPreview3D("https://example.com/3d/room103");

        roomMap.put(room1.getRoomNumber(), room1);
        roomMap.put(room2.getRoomNumber(), room2);
        roomMap.put(room3.getRoomNumber(), room3);
    }

    public RoomPreview getRoomPreview(String roomNumber) {

        return roomMap.get(roomNumber);
    }
}
