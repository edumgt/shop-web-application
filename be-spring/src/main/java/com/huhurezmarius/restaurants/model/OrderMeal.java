package com.huhurezmarius.restaurants.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "order_meal")
public class OrderMeal implements Serializable {
    @EmbeddedId
    private OrderMealPK id = new OrderMealPK();

    @ManyToOne
    @MapsId("order_id")
    @JoinColumn(name="order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @MapsId("meal_id")
    @JoinColumn(name="meal_id")
    private Meal meal;

    private int quantity;

    public OrderMeal() {
    }
    public OrderMeal(OrderMealPK id) {
        this.id = id;
    }
    public OrderMeal(Order order, Meal meal, int quantity) {
        this.order = order;
        this.meal = meal;
        this.quantity = quantity;
    }

    public OrderMealPK getId() {
        return id;
    }

    public void setId(OrderMealPK id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Meal getMeal() {
        return meal;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
