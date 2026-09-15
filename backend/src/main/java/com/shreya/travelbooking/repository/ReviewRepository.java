package com.shreya.travelbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shreya.travelbooking.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBookingId(String bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.bookingId = :bookingId")
    Double getAverageRatingByBookingId(@Param("bookingId") String bookingId);

}