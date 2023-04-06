package com.huhurezmarius.restaurants.response;

import com.huhurezmarius.restaurants.model.Role;

import java.util.Set;

public interface UsersInfoResponse {
    Long getId();
    String getUsername();
    String getEmail();
    boolean getBlocked();
    String getPhotoUrl();
    Set<Role> getRoles();
}
