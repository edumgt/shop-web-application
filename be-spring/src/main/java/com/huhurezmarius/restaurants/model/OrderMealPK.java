package com.huhurezmarius.restaurants.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderMealPK implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column(name="order_id")
    private Long orderId;
    @Column(name="meal_id")
    private Long mealId;

    public OrderMealPK() {
    }

    public OrderMealPK(Long orderId, Long mealId) {
        this.orderId = orderId;
        this.mealId = mealId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderMealPK that = (OrderMealPK) o;
        return orderId.equals(that.orderId) && mealId.equals(that.mealId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, mealId);
    }

    public Long getOrderIdd() {
        return orderId;
    }

    public void setOrderIdd(Long orderId) {
        this.orderId = orderId;
    }

    public Long getMealId() {
        return mealId;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
    }
}
