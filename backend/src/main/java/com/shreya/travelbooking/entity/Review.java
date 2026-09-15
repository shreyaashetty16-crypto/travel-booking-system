package com.shreya.travelbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String bookingType;

    private String bookingId;

    private int rating;

    private String comment;

    private String photoUrl;

    private String status;

    private LocalDateTime createdDate;


    public Review() {
        this.createdDate = LocalDateTime.now();
        this.status = "ACTIVE";
    }


    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getBookingType() {
        return bookingType;
    }

    public String getBookingId() {
        return bookingId;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }


    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}