package com.huhurezmarius.restaurants.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.huhurezmarius.restaurants.enums.StatusEnum;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "statuses")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="status_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatusEnum name;

    @OneToMany(mappedBy ="status")
    @JsonIgnore
    private Set<OrderStatus> orders;
    public Status() {}

    public Status(StatusEnum name) {
        this.name = name;
    }

    public Status(Set<OrderStatus> orders) {
        this.orders = orders;
    }

    public Set<OrderStatus> getOrders() {
        return orders;
    }

    public void setOrders(Set<OrderStatus> orders) {
        this.orders = orders;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StatusEnum getName() {
        return name;
    }

    public void setName(StatusEnum name) {
        this.name = name;
    }

//    public Order getOrder() {
//        return order;
//    }
//
//    public void setOrder(Order order) {
//        this.order = order;
//    }
//
//    public Set<OrderStatus> getOrders() {
//        return orders;
//    }
//
//    public void setOrders(Set<OrderStatus> orders) {
//        this.orders = orders;
//    }
}
