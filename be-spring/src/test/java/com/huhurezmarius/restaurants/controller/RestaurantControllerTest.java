package com.huhurezmarius.restaurants.controller;

import com.huhurezmarius.restaurants.model.Meal;
import com.huhurezmarius.restaurants.model.Restaurant;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.Set;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class RestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;


    private Restaurant defaultRestaurant() {
        Restaurant restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setName("Test");
        restaurant.setDescription("Test restaurant");
        Set<Meal> meals = new HashSet<>();
        Meal meal = new Meal();
        meal.setPrice(2.0);
        meal.setDescription("orange veg");
        meal.setName("carrot");
        meals.add(meal);
        restaurant.setMeals(meals);
        return restaurant;
    }
}

