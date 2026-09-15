package com.shreya.travelbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shreya.travelbooking.entity.Wishlist;
import com.shreya.travelbooking.repository.WishlistRepository;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    // Add item to wishlist
    public Wishlist addToWishlist(Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    // Get wishlist by username
    public List<Wishlist> getWishlistByUser(String userName) {
        return wishlistRepository.findByUserName(userName);
    }

    // Remove item from wishlist
    public String removeFromWishlist(Long id) {
        wishlistRepository.deleteById(id);
        return "Item removed from wishlist successfully.";
    }
}