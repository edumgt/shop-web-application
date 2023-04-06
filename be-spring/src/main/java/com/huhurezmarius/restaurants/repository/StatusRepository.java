package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.enums.StatusEnum;
import com.huhurezmarius.restaurants.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusRepository extends JpaRepository<Status,Long> {
    Status findByName(StatusEnum name);
}
