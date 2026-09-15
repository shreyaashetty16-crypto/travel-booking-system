package com.shreya.travelbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shreya.travelbooking.entity.Wishlist;
import com.shreya.travelbooking.service.WishlistService;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add item to wishlist
    @PostMapping("/add")
    public Wishlist addToWishlist(@RequestBody Wishlist wishlist) {
        return wishlistService.addToWishlist(wishlist);
    }

    // View wishlist by username
    @GetMapping("/{userName}")
    public List<Wishlist> getWishlist(@PathVariable String userName) {
        return wishlistService.getWishlistByUser(userName);
    }

    // Remove item from wishlist
    @DeleteMapping("/delete/{id}")
    public String removeFromWishlist(@PathVariable Long id) {
        return wishlistService.removeFromWishlist(id);
    }
}