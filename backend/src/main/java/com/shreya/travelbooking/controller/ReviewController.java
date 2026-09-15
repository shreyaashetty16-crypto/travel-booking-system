package com.shreya.travelbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shreya.travelbooking.entity.Review;
import com.shreya.travelbooking.service.ReviewService;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Add Review
    @PostMapping("/add")
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    // Get All Reviews
    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // Delete Review
    @DeleteMapping("/delete/{id}")
    public String deleteReview(@PathVariable Long id) {
        return reviewService.deleteReview(id);
    }

    // Report Review
    @PutMapping("/report/{id}")
    public Review reportReview(@PathVariable Long id) {
        return reviewService.reportReview(id);
    }

    // Get Average Rating by Booking ID
    @GetMapping("/average/{bookingId}")
    public Double getAverageRating(@PathVariable String bookingId) {
        return reviewService.getAverageRating(bookingId);
    }
}