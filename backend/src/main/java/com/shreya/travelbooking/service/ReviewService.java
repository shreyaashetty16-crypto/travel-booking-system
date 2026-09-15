package com.shreya.travelbooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.Review;
import com.shreya.travelbooking.repository.ReviewRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // Add Review
    public Review addReview(Review review) {

        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        return reviewRepository.save(review);
    }

    // Get All Reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Delete Review
    public String deleteReview(Long id) {

        if (!reviewRepository.existsById(id)) {
            return "Review not found";
        }

        reviewRepository.deleteById(id);
        return "Review deleted successfully";
    }

    // Report Review
    public Review reportReview(Long id) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setStatus("REPORTED");
        return reviewRepository.save(review);
    }

    // Get Average Rating
    public Double getAverageRating(String bookingId) {

        Double avg = reviewRepository.getAverageRatingByBookingId(bookingId);

        return avg != null ? avg : 0.0;
    }
}