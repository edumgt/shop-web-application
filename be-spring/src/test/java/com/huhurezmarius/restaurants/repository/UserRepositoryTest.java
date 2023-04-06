package com.huhurezmarius.restaurants.repository;

import com.huhurezmarius.restaurants.model.User;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class UserRepositoryTest {
    @Autowired
    UserRepository userRepository;

    @Test
    public void addUserTest() {
        User user = new User();
        user.setUsername("testUser");
        user.setEmail("testUser@gmail.com");
        user.setPassword("password");

        User expectedSavedUser = userRepository.saveAndFlush(user);
        Assert.assertEquals(expectedSavedUser.getEmail(),"testUser@gmail.com");
        Assert.assertEquals(expectedSavedUser.getUsername(),"testUser");
        Assert.assertEquals(expectedSavedUser.getPassword(),"password");
    }
}
