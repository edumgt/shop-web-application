package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.model.EmailConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailConfirmationTokenRepository extends JpaRepository<EmailConfirmationToken,Long> {
    EmailConfirmationToken findByConfirmationToken(String confirmationToken);
}
