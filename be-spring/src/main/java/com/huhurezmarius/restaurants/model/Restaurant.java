package com.huhurezmarius.restaurants.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(	name = "restaurants")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="restaurant_id")
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 250)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.ALL})
    @JoinTable(name ="Restaurant_Meal",
            joinColumns = {@JoinColumn(name="restaurant_id")},
            inverseJoinColumns = {@JoinColumn(name="meal_id")})
    private Set<Meal> meals;

    @ManyToMany(mappedBy="restaurants")
    private Set<User> users;
    public Restaurant() {}

    public Restaurant(Long id, @NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 250) String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Restaurant(Long id, @NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 250) String description, Set<Meal> meals) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.meals = meals;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<Meal> getMeals() {
        return meals;
    }

    public void setMeals(Set<Meal> meals) {
        this.meals = meals;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void addMeal(Meal meal) {
        meals.add(meal);
    }
    public void removeMeal(Meal meal) {
        meals.remove(meal);
    }
}
