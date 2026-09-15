package com.shreya.travelbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.RecommendationHistory;
import com.shreya.travelbooking.repository.RecommendationHistoryRepository;

@Service
public class RecommendationHistoryService {

    @Autowired
    private RecommendationHistoryRepository repository;

    // Save recommendation history
    public RecommendationHistory saveHistory(
            String userName,
            String destination,
            String category,
            double budget,
            String interaction) {

        RecommendationHistory history =
                new RecommendationHistory();

        history.setUserName(userName);
        history.setDestination(destination);
        history.setCategory(category);
        history.setBudget(budget);
        history.setInteraction(interaction);

        return repository.save(history);
    }

    // Get recommendation history for a user
    public List<RecommendationHistory> getHistory(
            String userName) {

        return repository.findByUserName(userName);
    }

    // Update recommendation feedback
    public RecommendationHistory updateFeedback(
            Long id,
            String interaction) {

        RecommendationHistory history =
                repository.findById(id).orElse(null);

        if (history == null) {
            return null;
        }

        history.setInteraction(interaction);

        return repository.save(history);
    }
}