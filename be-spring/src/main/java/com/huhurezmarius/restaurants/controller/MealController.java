package com.huhurezmarius.restaurants.controller;


import com.huhurezmarius.restaurants.model.Meal;
import com.huhurezmarius.restaurants.repository.MealRepository;
import com.huhurezmarius.restaurants.request.MealRequest;
import com.huhurezmarius.restaurants.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/meals")
public class MealController {
    @Autowired
    private MealRepository mealRepository;

    @GetMapping("/getAll")
    List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    @PostMapping("/addMeal")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> addMeal(@Valid @RequestBody MealRequest mealRequest) {
        if(mealRepository.existsByName(mealRequest.getName())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Name of meal is already used!"));
        }

        Meal meal = new Meal();
        meal.setName(mealRequest.getName());
        meal.setDescription(mealRequest.getDescription());
        meal.setPrice(mealRequest.getPrice());

        mealRepository.save(meal);

        return ResponseEntity.ok("Meal added successfully");
    }

    @PostMapping("/updateMeal")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> updateMeal(@Valid @RequestBody MealRequest mealRequest, @RequestParam(name="mealId") Long mealId) {
        if(!mealRepository.existsById(mealId)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Meal does not exists!"));
        }

        Meal meal = mealRepository.getOne(mealId);

        if(mealRequest.getName() != null && !mealRequest.getName().isEmpty() && !mealRequest.getName().isBlank()) {
            meal.setName(mealRequest.getName());
        }
        if(mealRequest.getDescription() != null && !mealRequest.getDescription().isEmpty() && !mealRequest.getDescription().isBlank()) {
            meal.setDescription(mealRequest.getDescription());
        }
        if(mealRequest.getPrice() != null ) {
            meal.setPrice(mealRequest.getPrice().doubleValue());
        }
        mealRepository.save(meal);

        return ResponseEntity.ok("Meal updated successfully");
    }

    @PutMapping("/deleteMeal")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> deleteMeal(@RequestParam(name="mealId") Long mealId) {
        if (!mealRepository.existsById(mealId)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Meal does not exists!"));
        }

        mealRepository.deleteById(mealId);
        return ResponseEntity.ok("Meal deleted successfully");
    }
}
