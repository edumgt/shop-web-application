package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.enums.TypeEnum;
import com.huhurezmarius.restaurants.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeRepository extends JpaRepository<Type,Long> {
    Type findByName(TypeEnum name);
}
