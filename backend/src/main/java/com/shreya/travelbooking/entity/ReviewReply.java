package com.shreya.travelbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ReviewReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reviewId;

    private String userName;

    private String replyText;

    private LocalDateTime createdDate;

    public ReviewReply() {
        this.createdDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public String getUserName() {
        return userName;
    }

    public String getReplyText() {
        return replyText;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setReplyText(String replyText) {
        this.replyText = replyText;
    }
}