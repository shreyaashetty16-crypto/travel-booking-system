package com.shreya.travelbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.Seat;

@Service
public class SeatService {

    private List<Seat> seats = new ArrayList<>();

    public SeatService() {

        seats.add(new Seat("1A", true, true, 2500));
        seats.add(new Seat("1B", true, false, 1500));
        seats.add(new Seat("2A", true, false, 1500));
        seats.add(new Seat("2B", true, true, 2500));
    }

    public List<Seat> getAllSeats() {
        return seats;
    }

    public Seat bookSeat(String seatNumber) {

        for (Seat seat : seats) {

            if (seat.getSeatNumber().equalsIgnoreCase(seatNumber)) {
                seat.setAvailable(false);
                return seat;
            }
        }

        return null;
    }

    public List<Seat> getPremiumSeats() {

        List<Seat> premiumSeats = new ArrayList<>();

        for (Seat seat : seats) {

            if (seat.isPremium()) {
                premiumSeats.add(seat);
            }
        }

        return premiumSeats;
    }

    public List<Seat> getAvailableSeats() {

        List<Seat> availableSeats = new ArrayList<>();

        for (Seat seat : seats) {

            if (seat.isAvailable()) {
                availableSeats.add(seat);
            }
        }

        return availableSeats;
    }
}