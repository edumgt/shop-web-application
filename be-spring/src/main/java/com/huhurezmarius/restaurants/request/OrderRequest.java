package com.huhurezmarius.restaurants.request;

import java.util.Date;
import java.util.List;

public class OrderRequest {

    private List<MealRequest> meals;
    private Date date;
    private Long restaurantId;
    private Long userId;
    private double totalAmount;
    public OrderRequest() {
    }

    public OrderRequest(List<MealRequest> meals, Date date, double totalAmount, Long restaurantId) {
        this.meals = meals;
        this.date = date;
        this.restaurantId = restaurantId;
    }

    public OrderRequest(List<MealRequest> meals, Date date, Long restaurantId, double totalAmount) {
        this.meals = meals;
        this.date = date;
        this.restaurantId = restaurantId;
        this.totalAmount = totalAmount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<MealRequest> getMeals() {
        return meals;
    }

    public void setMeals(List<MealRequest> meals) {
        this.meals = meals;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
}
