package com.shreya.travelbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.Room;

@Service
public class RoomService {

    private List<Room> rooms = new ArrayList<>();

    public RoomService() {

        rooms.add(new Room("101", "Standard", true, 3000));
        rooms.add(new Room("102", "Deluxe", true, 5000));
        rooms.add(new Room("103", "Suite", true, 8000));
    }

    public List<Room> getAllRooms() {

        return rooms;
    }

    public Room bookRoom(String roomNumber) {

        for (Room room : rooms) {

            if (room.getRoomNumber().equalsIgnoreCase(roomNumber)) {
                room.setAvailable(false);
                return room;
            }
        }

        return null;
    }

    public List<Room> getAvailableRooms() {

        List<Room> availableRooms = new ArrayList<>();

        for (Room room : rooms) {

            if (room.isAvailable()) {
                availableRooms.add(room);
            }
        }

        return availableRooms;
    }
}