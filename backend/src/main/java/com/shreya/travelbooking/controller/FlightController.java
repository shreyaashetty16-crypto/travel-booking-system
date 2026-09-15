package com.shreya.travelbooking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shreya.travelbooking.entity.Flight;
import com.shreya.travelbooking.entity.RecommendationHistory;

import com.shreya.travelbooking.model.Cancellation;
import com.shreya.travelbooking.model.CancellationReason;
import com.shreya.travelbooking.model.FlightStatus;
import com.shreya.travelbooking.model.Notification;
import com.shreya.travelbooking.model.PriceDetails;
import com.shreya.travelbooking.model.PriceFreeze;
import com.shreya.travelbooking.model.PriceHistory;
import com.shreya.travelbooking.model.RefundStatus;
import com.shreya.travelbooking.model.Room;
import com.shreya.travelbooking.model.RoomPreview;
import com.shreya.travelbooking.model.Seat;
import com.shreya.travelbooking.model.TravelRecommendation;
import com.shreya.travelbooking.model.UserPreference;

import com.shreya.travelbooking.service.CancellationReasonService;
import com.shreya.travelbooking.service.CancellationService;
import com.shreya.travelbooking.service.FlightService;
import com.shreya.travelbooking.service.FlightStatusService;
import com.shreya.travelbooking.service.NotificationService;
import com.shreya.travelbooking.service.PriceFreezeService;
import com.shreya.travelbooking.service.PricingService;
import com.shreya.travelbooking.service.RecommendationHistoryService;
import com.shreya.travelbooking.service.RecommendationService;
import com.shreya.travelbooking.service.RefundStatusService;
import com.shreya.travelbooking.service.RoomPreviewService;
import com.shreya.travelbooking.service.RoomService;
import com.shreya.travelbooking.service.SeatService;
import com.shreya.travelbooking.service.UserPreferenceService;

@RestController
@RequestMapping("/flight")
public class FlightController {

    @Autowired
    private FlightService flightService;

    @Autowired
    private FlightStatusService flightStatusService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PricingService pricingService;

    @Autowired
    private PriceFreezeService priceFreezeService;

    @Autowired
    private CancellationService cancellationService;

    @Autowired
    private CancellationReasonService cancellationReasonService;

    @Autowired
    private RefundStatusService refundStatusService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private RecommendationHistoryService recommendationHistoryService;

    @Autowired
    private SeatService seatService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomPreviewService roomPreviewService;

    @Autowired
    private UserPreferenceService userPreferenceService;


    // ================= FLIGHT CRUD =================

    @PostMapping("/save")
    public Flight saveFlight(@RequestBody Flight flight) {
        return flightService.addFlight(flight);
    }

    @GetMapping("/list")
    public List<Flight> getFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/{id}")
    public Flight getFlight(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFlight(@PathVariable Long id) {
        return flightService.deleteFlight(id);
    }


    // ================= FLIGHT STATUS =================

    @GetMapping("/status/all")
    public List<FlightStatus> getStatusList() {
        return flightStatusService.getAllFlightStatus();
    }

    @GetMapping("/status/{flightNumber}")
    public FlightStatus getFlightStatus(
            @PathVariable String flightNumber) {

        return flightStatusService.getFlightStatus(flightNumber);
    }


    // ================= NOTIFICATION =================

    @GetMapping("/notification/{flightNumber}")
    public Notification showNotification(
            @PathVariable String flightNumber) {

        return notificationService.getNotification(flightNumber);
    }


    // ================= PRICING =================

    @GetMapping("/price/{flightNumber}")
    public PriceDetails getPrice(
            @PathVariable String flightNumber) {

        return pricingService.getPrice(flightNumber);
    }

    @GetMapping("/pricehistory/{flightNumber}")
    public PriceHistory getPriceHistory(
            @PathVariable String flightNumber) {

        return pricingService.getPriceHistory(flightNumber);
    }


    // ================= PRICE FREEZE =================

    @PostMapping("/freeze/{flightNumber}")
    public PriceFreeze freezePrice(
            @PathVariable String flightNumber,
            @RequestParam double price) {

        return priceFreezeService.freezePrice(
                flightNumber,
                price);
    }

    @GetMapping("/freeze/{flightNumber}")
    public PriceFreeze getFrozenPrice(
            @PathVariable String flightNumber) {

        return priceFreezeService.getFrozenPrice(flightNumber);
    }


    // ================= CANCELLATION =================

    @PostMapping("/cancel/{flightNumber}")
    public Cancellation cancelFlight(
            @PathVariable String flightNumber,
            @RequestParam double bookingAmount,
            @RequestParam String reason,
            @RequestParam boolean cancelledWithin24Hours) {

        return cancellationService.cancelBooking(
                flightNumber,
                bookingAmount,
                reason,
                cancelledWithin24Hours);
    }

    @GetMapping("/cancel/all")
    public Map<String, Cancellation> getAllCancelledBookings() {
        return cancellationService.getAllCancelledBookings();
    }

    @GetMapping("/refund/{flightNumber}")
    public Cancellation getRefund(
            @PathVariable String flightNumber) {

        return cancellationService.getRefundStatus(flightNumber);
    }


    // ================= REFUND STATUS =================

    @GetMapping("/refundstatus/{flightNumber}")
    public RefundStatus showRefundStatus(
            @PathVariable String flightNumber) {

        return refundStatusService.getRefundStatus(flightNumber);
    }

    @PutMapping("/refundstatus/{flightNumber}")
    public RefundStatus updateRefundStatus(
            @PathVariable String flightNumber,
            @RequestParam String status) {

        return refundStatusService.updateRefundStatus(
                flightNumber,
                status);
    }


    // ================= CANCELLATION REASON =================

    @GetMapping("/cancellation/reasons")
    public CancellationReason getCancellationReasons() {
        return cancellationReasonService.getReasons();
    }


    // ================= RECOMMENDATION =================

    @GetMapping("/recommendation")
    public TravelRecommendation getRecommendation(
            @RequestParam double budget,
            @RequestParam(defaultValue = "general") String preference) {

        return recommendationService.getRecommendation(
                budget,
                preference);
    }


    // ================= PERSONALIZED RECOMMENDATION =================

    @GetMapping("/recommendation/personalized")
    public TravelRecommendation getPersonalizedRecommendation(
            @RequestParam String userName,
            @RequestParam double budget) {

        UserPreference preference =
                userPreferenceService.getPreference(userName);

        /*
         * IMPORTANT:
         * If no preference exists, do NOT call
         * preference.getPreferredDestination().
         *
         * This prevents the NullPointerException you were getting.
         */
        if (preference == null) {

            return recommendationService
                    .getRecommendation(budget);
        }

        String preferredDestination =
                preference.getPreferredDestination();

        /*
         * If the user exists but has not selected
         * a destination, use normal budget recommendation.
         */
        if (preferredDestination == null ||
                preferredDestination.trim().isEmpty()) {

            return recommendationService
                    .getRecommendation(budget);
        }

        return recommendationService
                .getPersonalizedRecommendation(
                        budget,
                        preferredDestination);
    }


    // ================= HISTORY BASED RECOMMENDATION =================

    @GetMapping("/recommendation/history-based")
    public TravelRecommendation getHistoryBasedRecommendation(
            @RequestParam String userName,
            @RequestParam double budget) {

        return recommendationService
                .getHistoryBasedRecommendation(
                        userName,
                        budget);
    }


    // ================= COLLABORATIVE RECOMMENDATION =================

    @GetMapping("/recommendation/collaborative")
    public TravelRecommendation getCollaborativeRecommendation(
            @RequestParam String userName,
            @RequestParam double budget) {

        return recommendationService
                .getCollaborativeRecommendation(
                        userName,
                        budget);
    }


    // ================= RECOMMENDATION HISTORY =================

    @PostMapping("/recommendation/history")
    public RecommendationHistory saveRecommendationHistory(
            @RequestParam String userName,
            @RequestParam String destination,
            @RequestParam String category,
            @RequestParam double budget,
            @RequestParam String interaction) {

        return recommendationHistoryService.saveHistory(
                userName,
                destination,
                category,
                budget,
                interaction);
    }


    @GetMapping("/recommendation/history/{userName}")
    public List<RecommendationHistory> getRecommendationHistory(
            @PathVariable String userName) {

        return recommendationHistoryService
                .getHistory(userName);
    }


    // ================= RECOMMENDATION FEEDBACK =================

    @PutMapping("/recommendation/history/{id}/feedback")
    public RecommendationHistory updateRecommendationFeedback(
            @PathVariable Long id,
            @RequestParam String interaction) {

        return recommendationHistoryService
                .updateFeedback(
                        id,
                        interaction);
    }


    // ================= SEATS =================

    @GetMapping("/seats")
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/seats/available")
    public List<Seat> getAvailableSeats() {
        return seatService.getAvailableSeats();
    }

    @PostMapping("/seats/book/{seatNumber}")
    public Seat bookSeat(
            @PathVariable String seatNumber) {

        return seatService.bookSeat(seatNumber);
    }

    @GetMapping("/seats/premium")
    public List<Seat> getPremiumSeats() {
        return seatService.getPremiumSeats();
    }


    // ================= ROOMS =================

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/rooms/available")
    public List<Room> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }

    @PostMapping("/rooms/book/{roomNumber}")
    public Room bookRoom(
            @PathVariable String roomNumber) {

        return roomService.bookRoom(roomNumber);
    }

    @GetMapping("/rooms/preview/{roomNumber}")
    public RoomPreview getRoomPreview(
            @PathVariable String roomNumber) {

        return roomPreviewService
                .getRoomPreview(roomNumber);
    }


    // ================= USER PREFERENCE =================

    @PostMapping("/preferences")
    public UserPreference savePreference(
            @RequestBody UserPreference preference) {

        return userPreferenceService
                .savePreference(preference);
    }

    @GetMapping("/preferences/{userName}")
    public UserPreference getPreference(
            @PathVariable String userName) {

        return userPreferenceService
                .getPreference(userName);
    }

    @PutMapping("/preferences/{userName}")
    public UserPreference updatePreference(
            @PathVariable String userName,
            @RequestBody UserPreference preference) {

        return userPreferenceService
                .updatePreference(
                        userName,
                        preference);
    }

    @DeleteMapping("/preferences/{userName}")
    public String deletePreference(
            @PathVariable String userName) {

        return userPreferenceService
                .deletePreference(userName);
    }

}