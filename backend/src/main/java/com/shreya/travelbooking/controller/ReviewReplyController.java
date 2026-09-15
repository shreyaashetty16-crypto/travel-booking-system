package com.shreya.travelbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shreya.travelbooking.entity.ReviewReply;
import com.shreya.travelbooking.service.ReviewReplyService;

@RestController
@RequestMapping("/reply")
public class ReviewReplyController {

    @Autowired
    private ReviewReplyService reviewReplyService;

    // Add Reply
    @PostMapping("/add")
    public ReviewReply addReply(@RequestBody ReviewReply reply) {
        return reviewReplyService.addReply(reply);
    }

    // Get Replies for a Review
    @GetMapping("/{reviewId}")
    public List<ReviewReply> getReplies(@PathVariable Long reviewId) {
        return reviewReplyService.getRepliesByReviewId(reviewId);
    }

    // Delete Reply
    @DeleteMapping("/delete/{id}")
    public String deleteReply(@PathVariable Long id) {
        return reviewReplyService.deleteReply(id);
    }
}