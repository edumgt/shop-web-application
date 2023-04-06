package com.huhurezmarius.restaurants.model;

import com.huhurezmarius.restaurants.enums.TypeEnum;

import javax.persistence.*;

@Entity
@Table(name = "TYPES")
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="type_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TypeEnum name;


    public Type() {}
    public Type(TypeEnum name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeEnum getName() {
        return name;
    }

    public void setName(TypeEnum name) {
        this.name = name;
    }

}
