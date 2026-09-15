package com.shreya.travelbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreya.travelbooking.entity.ReviewReply;

public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Long> {

    List<ReviewReply> findByReviewId(Long reviewId);

}