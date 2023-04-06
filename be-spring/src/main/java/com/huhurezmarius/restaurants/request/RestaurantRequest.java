package com.huhurezmarius.restaurants.request;

import java.util.List;

public class RestaurantRequest {

    private String name;

    private String description;

    private List<Long> mealsIds;

    public List<Long> getMealsIds() {
        return mealsIds;
    }

    public void setMealsIds(List<Long> mealsIds) {
        this.mealsIds = mealsIds;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
