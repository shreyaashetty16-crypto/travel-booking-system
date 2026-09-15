package com.shreya.travelbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreya.travelbooking.entity.RecommendationHistory;

public interface RecommendationHistoryRepository
        extends JpaRepository<RecommendationHistory, Long> {

    List<RecommendationHistory> findByUserName(String userName);
}