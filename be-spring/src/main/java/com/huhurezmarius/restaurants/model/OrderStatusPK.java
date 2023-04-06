package com.huhurezmarius.restaurants.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderStatusPK implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column(name="order_id")
    private Long orderId;
    @Column(name="status_id")
    private Long statusId;

    public OrderStatusPK() {
    }

    public OrderStatusPK(Long orderId, Long statusId) {
        this.orderId = orderId;
        this.statusId = statusId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderStatusPK that = (OrderStatusPK) o;
        return orderId.equals(that.orderId) && statusId.equals(that.statusId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, statusId);
    }

    public Long getOrderIdd() {
        return orderId;
    }

    public void setOrderIdd(Long orderId) {
        this.orderId = orderId;
    }

    public Long getStatusId() {
        return statusId;
    }

    public void setStatusId(Long statusId) {
        this.statusId = statusId;
    }
}
