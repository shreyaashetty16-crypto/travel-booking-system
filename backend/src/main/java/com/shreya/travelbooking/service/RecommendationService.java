package com.shreya.travelbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.RecommendationHistory;
import com.shreya.travelbooking.model.TravelRecommendation;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationHistoryService recommendationHistoryService;


    // =========================================================
    // 1. BASIC BUDGET RECOMMENDATION
    // =========================================================

    public TravelRecommendation getRecommendation(double budget) {

        TravelRecommendation travel = new TravelRecommendation();

        travel.setBudget(budget);

        if (budget <= 10000) {

            travel.setDestination("Mysore");
            travel.setRecommendation("Budget Friendly Trip");
            travel.setReason(
                    "This destination is suitable for your budget."
            );

        } else if (budget <= 30000) {

            travel.setDestination("Goa");
            travel.setRecommendation("Beach Vacation");
            travel.setReason(
                    "Goa is a popular beach destination within your budget."
            );

        } else {

            travel.setDestination("Kashmir");
            travel.setRecommendation("Premium Holiday");
            travel.setReason(
                    "Your budget allows for a premium holiday experience."
            );
        }

        return travel;
    }


    // =========================================================
    // 2. PREFERENCE BASED RECOMMENDATION
    // =========================================================

    public TravelRecommendation getRecommendation(
            double budget,
            String preference) {

        if (preference == null ||
                preference.trim().isEmpty() ||
                preference.equalsIgnoreCase("general")) {

            return getRecommendation(budget);
        }

        TravelRecommendation travel = new TravelRecommendation();

        travel.setBudget(budget);

        String destination;

        if (preference.equalsIgnoreCase("beach")) {

            destination = budget <= 30000 ? "Goa" : "Bali";

            travel.setDestination(destination);
            travel.setRecommendation("Beach Vacation");
            travel.setReason(
                    "You selected a beach preference, so a beach destination was recommended."
            );

        } else if (preference.equalsIgnoreCase("mountain")) {

            destination = budget <= 30000 ? "Manali" : "Kashmir";

            travel.setDestination(destination);
            travel.setRecommendation("Mountain Holiday");
            travel.setReason(
                    "You selected a mountain preference, so a mountain destination was recommended."
            );

        } else if (preference.equalsIgnoreCase("city")) {

            destination = "Bangalore";

            travel.setDestination(destination);
            travel.setRecommendation("City Vacation");
            travel.setReason(
                    "You selected a city preference."
            );

        } else {

            destination = preference.trim();

            travel.setDestination(destination);
            travel.setRecommendation(
                    "Recommended based on your preference"
            );
            travel.setReason(
                    "This recommendation matches your selected preference: "
                            + destination
            );
        }

        return travel;
    }


    // =========================================================
    // 3. PERSONALIZED RECOMMENDATION
    // =========================================================

    public TravelRecommendation getPersonalizedRecommendation(
            double budget,
            String preferredDestination) {

        if (preferredDestination == null ||
                preferredDestination.trim().isEmpty()) {

            return getRecommendation(budget);
        }

        TravelRecommendation travel = new TravelRecommendation();

        String destination = preferredDestination.trim();

        travel.setBudget(budget);
        travel.setDestination(destination);

        travel.setRecommendation(
                "Personalized recommendation for " + destination
        );

        travel.setReason(
                "You previously selected "
                        + destination
                        + " as your preferred destination."
        );

        return travel;
    }


    // =========================================================
    // 4. HISTORY BASED RECOMMENDATION
    // =========================================================

    public TravelRecommendation getHistoryBasedRecommendation(
            String userName,
            double budget) {

        List<RecommendationHistory> history =
                recommendationHistoryService.getHistory(userName);

        if (history == null || history.isEmpty()) {

            TravelRecommendation travel =
                    getRecommendation(budget);

            travel.setReason(
                    "There is not enough booking history yet, "
                            + "so this recommendation is based on your budget."
            );

            return travel;
        }

        // Find the most recent useful interaction
        RecommendationHistory selectedHistory = null;

        for (int i = history.size() - 1; i >= 0; i--) {

            RecommendationHistory item = history.get(i);

            if (item != null &&
                    item.getDestination() != null &&
                    !item.getDestination().trim().isEmpty()) {

                selectedHistory = item;
                break;
            }
        }

        if (selectedHistory == null) {

            TravelRecommendation travel =
                    getRecommendation(budget);

            travel.setReason(
                    "Your history does not contain a usable destination, "
                            + "so the recommendation is based on your budget."
            );

            return travel;
        }

        String destination =
                selectedHistory.getDestination();

        TravelRecommendation travel =
                new TravelRecommendation();

        travel.setBudget(budget);
        travel.setDestination(destination);

        travel.setRecommendation(
                "Recommended based on your travel history"
        );

        travel.setReason(
                "You previously interacted with "
                        + destination
                        + ", so we selected it based on your past activity."
        );

        return travel;
    }


    // =========================================================
    // 5. COLLABORATIVE RECOMMENDATION
    // =========================================================

    public TravelRecommendation getCollaborativeRecommendation(
            String userName,
            double budget) {

        List<RecommendationHistory> history =
                recommendationHistoryService.getHistory(userName);

        /*
         * Simple collaborative-filtering style implementation.
         *
         * For now we analyse the user's previous interactions.
         * Later this can be expanded to compare multiple users'
         * preferences and recommend destinations liked by similar users.
         */

        if (history == null || history.isEmpty()) {

            TravelRecommendation travel =
                    getRecommendation(budget);

            travel.setReason(
                    "There is not enough user interaction data yet, "
                            + "so a budget-based recommendation is shown."
            );

            return travel;
        }

        String recommendedDestination = null;
        String recommendedCategory = null;

        // Prefer a helpful/liked interaction
        for (int i = history.size() - 1; i >= 0; i--) {

            RecommendationHistory item = history.get(i);

            if (item == null) {
                continue;
            }

            String interaction = item.getInteraction();

            if (interaction != null &&
                    (interaction.equalsIgnoreCase("helpful")
                            || interaction.equalsIgnoreCase("liked")
                            || interaction.equalsIgnoreCase("like")
                            || interaction.equalsIgnoreCase("yes"))) {

                recommendedDestination =
                        item.getDestination();

                recommendedCategory =
                        item.getCategory();

                break;
            }
        }

        // If no positive interaction exists,
        // use the latest destination from history.
        if (recommendedDestination == null) {

            for (int i = history.size() - 1; i >= 0; i--) {

                RecommendationHistory item = history.get(i);

                if (item != null &&
                        item.getDestination() != null &&
                        !item.getDestination().trim().isEmpty()) {

                    recommendedDestination =
                            item.getDestination();

                    recommendedCategory =
                            item.getCategory();

                    break;
                }
            }
        }

        // Nothing usable in history
        if (recommendedDestination == null) {

            TravelRecommendation travel =
                    getRecommendation(budget);

            travel.setReason(
                    "There is not enough interaction data "
                            + "to create a personalized recommendation."
            );

            return travel;
        }

        TravelRecommendation travel =
                new TravelRecommendation();

        travel.setBudget(budget);
        travel.setDestination(recommendedDestination);

        if (recommendedCategory != null &&
                !recommendedCategory.trim().isEmpty()) {

            travel.setRecommendation(
                    "Recommended " +
                    recommendedCategory +
                    " based on your previous interactions"
            );

        } else {

            travel.setRecommendation(
                    "Recommended based on similar travel preferences"
            );
        }

        travel.setReason(
                "This recommendation uses your previous interactions "
                        + "to identify destinations you may be interested in."
        );

        return travel;
    }
}