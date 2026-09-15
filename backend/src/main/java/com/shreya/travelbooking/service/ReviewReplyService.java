package com.shreya.travelbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.ReviewReply;
import com.shreya.travelbooking.repository.ReviewReplyRepository;

@Service
public class ReviewReplyService {

    @Autowired
    private ReviewReplyRepository reviewReplyRepository;

    // Add Reply
    public ReviewReply addReply(ReviewReply reply) {
        return reviewReplyRepository.save(reply);
    }

    // Get Replies by Review ID
    public List<ReviewReply> getRepliesByReviewId(Long reviewId) {
        return reviewReplyRepository.findByReviewId(reviewId);
    }

    // Delete Reply
    public String deleteReply(Long id) {
        reviewReplyRepository.deleteById(id);
        return "Reply deleted successfully";
    }
}