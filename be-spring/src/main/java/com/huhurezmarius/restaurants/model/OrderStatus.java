package com.huhurezmarius.restaurants.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "order_status")
public class OrderStatus implements Serializable {
    @EmbeddedId
    private OrderStatusPK id = new OrderStatusPK();


    @ManyToOne
    @MapsId("order_id")
    @JoinColumn(name="order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @MapsId("status_id")
    @JoinColumn(name="status_id")
    private Status status;

    private Date date;

    public OrderStatus() {
    }
    public OrderStatus(OrderStatusPK id) {
        this.id = id;
    }
    public OrderStatus(Order order, Status status, Date date) {
        this.order = order;
        this.status = status;
        this.date = date;
    }

    public OrderStatusPK getId() {
        return id;
    }

    public void setId(OrderStatusPK id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
