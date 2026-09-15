package com.shreya.travelbooking.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.shreya.travelbooking.model.UserPreference;

@Service
public class UserPreferenceService {

    private Map<String, UserPreference> preferences = new HashMap<>();

    public UserPreference savePreference(UserPreference preference) {

        preferences.put(preference.getUserName(), preference);
        return preference;
    }

    public UserPreference getPreference(String userName) {

        return preferences.get(userName);
    }

    public UserPreference updatePreference(String userName, UserPreference preference) {

        preferences.put(userName, preference);
        return preference;
    }

    public String deletePreference(String userName) {

        preferences.remove(userName);
        return "Preference deleted successfully";
    }
}