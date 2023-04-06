package com.huhurezmarius.restaurants.response;

import com.huhurezmarius.restaurants.model.Meal;

import java.util.Set;

public interface RestaurantResponse {
    Long getId();
    String getName();
    String getDescription();
    Set<Meal> getMeals();

}
