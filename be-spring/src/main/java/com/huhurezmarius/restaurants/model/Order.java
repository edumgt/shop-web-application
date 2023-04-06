package com.huhurezmarius.restaurants.model;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Long id;

    private Date date;

    @Column(name="total_amount")
    private double totalAmount;

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE})
    @JoinTable(name ="order_restaurant",
            joinColumns = {@JoinColumn(name="order_id")},
            inverseJoinColumns = {@JoinColumn(name="restaurant_id")})
    private Set<Restaurant> restaurants = new HashSet<Restaurant>();

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE})
    @JoinTable(name ="order_user",
            joinColumns = {@JoinColumn(name="order_id")},
            inverseJoinColumns = {@JoinColumn(name="user_id")})
    private Set<User> users = new HashSet<User>();

    @OneToMany(mappedBy = "order")
    private Set<OrderStatus> orderStatuses = new HashSet<OrderStatus>();

    @OneToMany(mappedBy = "order")
    private Set<OrderMeal> orderMeals = new HashSet<>();

    public Order() {}



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order(Long id, Set<OrderMeal> orderMeals, Date date, double totalAmount, Set<Restaurant> restaurants,Set<OrderStatus> orderStatuses) {
        this.id = id;
        this.orderMeals = orderMeals;
        this.date = date;
        this.totalAmount = totalAmount;
        this.restaurants = restaurants;
        this.orderStatuses = orderStatuses;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<OrderStatus> getOrderStatuses() {
        return orderStatuses;
    }

    public void setOrderStatuses(Set<OrderStatus> orderStatuses) {
        this.orderStatuses = orderStatuses;
    }

    public Set<Restaurant> getRestaurants() {
        return restaurants;
    }

    public void setRestaurants(Set<Restaurant> restaurants) {
        this.restaurants = restaurants;
    }

    public Set<OrderMeal> getOrderMeals() {
        return orderMeals;
    }

    public void setOrderMeals(Set<OrderMeal> orderMeals) {
        this.orderMeals = orderMeals;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void addOrderStatus(OrderStatus status) {
        this.orderStatuses.add(status);
    }
    public void removeRestaurant(Restaurant rr) {
        this.restaurants.remove(rr);
    }
}
