package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.model.Restaurant;
import com.huhurezmarius.restaurants.response.RestaurantResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByName(String name);

    Boolean existsByName(String name);
    List<RestaurantResponse> findBy();

    List<RestaurantResponse> findByUsersId(Long userId);
}
