package com.shreya.travelbooking.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String itemType;

    private String itemId;

    private String itemName;

    private LocalDateTime createdDate;

    public Wishlist() {
        this.createdDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getItemType() {
        return itemType;
    }

    public String getItemId() {
        return itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
}