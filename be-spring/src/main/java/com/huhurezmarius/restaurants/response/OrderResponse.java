package com.huhurezmarius.restaurants.response;

import com.huhurezmarius.restaurants.model.Meal;
import com.huhurezmarius.restaurants.model.Restaurant;
import com.huhurezmarius.restaurants.model.Status;

import java.util.Date;
import java.util.Set;

interface OrderStatusResponse {
    Status getStatus();
    Date getDate();
}
interface OrderMealResponse {
    Meal getMeal();
    int getQuantity();
}
public interface OrderResponse {
    Long getId();
    Date getDate();
    double getTotalAmount();
    Set<Restaurant> getRestaurants();
    Set<OrderStatusResponse> getOrderStatuses();
    Set<OrderMealResponse> getOrderMeals();
}
