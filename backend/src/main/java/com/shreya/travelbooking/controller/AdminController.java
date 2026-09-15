package com.shreya.travelbooking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shreya.travelbooking.entity.Admin;
import com.shreya.travelbooking.service.AdminService;
import com.shreya.travelbooking.service.ReviewService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ReviewService reviewService;

    // Register Admin
    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    // Admin Login
    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        return adminService.login(admin.getUsername(), admin.getPassword());
    }

    // View All Reviews
    @GetMapping("/reviews")
    public Object getAllReviews() {
        return reviewService.getAllReviews();
    }

    // Delete Review
    @DeleteMapping("/reviews/{id}")
    public String deleteReview(@PathVariable Long id) {
        return reviewService.deleteReview(id);
    }
}