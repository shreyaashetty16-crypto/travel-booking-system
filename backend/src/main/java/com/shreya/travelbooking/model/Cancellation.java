package com.shreya.travelbooking.model;

public class Cancellation {

    private String flightNumber;
    private double bookingAmount;
    private double refundAmount;
    private int refundPercentage;
    private String reason;
    private String refundStatus;
    private boolean cancelledWithin24Hours;

    public Cancellation() {

    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public double getBookingAmount() {
        return bookingAmount;
    }

    public void setBookingAmount(double bookingAmount) {
        this.bookingAmount = bookingAmount;
    }

    public double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(double refundAmount) {
        this.refundAmount = refundAmount;
    }

    public int getRefundPercentage() {
        return refundPercentage;
    }

    public void setRefundPercentage(int refundPercentage) {
        this.refundPercentage = refundPercentage;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(String refundStatus) {
        this.refundStatus = refundStatus;
    }

    public boolean isCancelledWithin24Hours() {
        return cancelledWithin24Hours;
    }

    public void setCancelledWithin24Hours(boolean cancelledWithin24Hours) {
        this.cancelledWithin24Hours = cancelledWithin24Hours;
    }

}