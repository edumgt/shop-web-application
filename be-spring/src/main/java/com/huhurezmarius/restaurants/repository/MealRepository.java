package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    Optional<Meal> findByName(String name);

    Boolean existsByName(String name);
}
