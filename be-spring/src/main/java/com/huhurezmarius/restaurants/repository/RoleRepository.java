package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.enums.RoleEnum;
import com.huhurezmarius.restaurants.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Long> {
    Role findByName(RoleEnum name);
}
