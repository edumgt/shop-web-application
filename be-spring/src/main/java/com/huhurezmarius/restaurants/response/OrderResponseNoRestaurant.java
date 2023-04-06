package com.huhurezmarius.restaurants.response;

import java.util.Date;
import java.util.Set;
interface Rest {
    String getName();
}
public interface OrderResponseNoRestaurant {
    Long getId();
    Date getDate();
    double getTotalAmount();
    Set<OrderStatusResponse> getOrderStatuses();
    Set<OrderMealResponse> getOrderMeals();
    Set<Rest> getRestaurants();
}
