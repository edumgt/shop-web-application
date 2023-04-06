package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.model.Order;
import com.huhurezmarius.restaurants.response.OrderResponseNoRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<OrderResponseNoRestaurant> findBy();

    List<OrderResponseNoRestaurant> findByUsersId(Long id);
    List<OrderResponseNoRestaurant> findByRestaurantsId(Long id);

}
