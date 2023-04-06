package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.model.Order;
import com.huhurezmarius.restaurants.model.OrderStatus;
import com.huhurezmarius.restaurants.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatus,Long> {
    OrderStatus findByStatus(Status status);
    OrderStatus findByOrderAndStatus(Order order, Status status);
}
