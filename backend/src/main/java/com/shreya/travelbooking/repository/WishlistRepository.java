package com.shreya.travelbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shreya.travelbooking.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Get wishlist by user
    List<Wishlist> findByUserName(String userName);

}