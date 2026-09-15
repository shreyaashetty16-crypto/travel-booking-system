package com.shreya.travelbooking.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.Admin;
import com.shreya.travelbooking.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Login
    public String login(String username, String password) {

        Optional<Admin> admin =
                adminRepository.findByUsernameAndPassword(username, password);

        if (admin.isPresent()) {
            return "Login Successful";
        }

        return "Invalid Username or Password";
    }

    // Register Admin (optional)
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
}