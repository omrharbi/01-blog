package com.__blog.model.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "posts")
@Entity
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    // @Column(name = "title", nullable = false)
    // private String title;
    @Column(name = "description", nullable = false)
    private String description;
    @Column(name = "image", nullable = true)
    private String image;
    @ManyToOne()
    @JoinColumn(name="user_id",nullable=false)
    private User user;
    
    @OneToMany(mappedBy="post",cascade=CascadeType.ALL,orphanRemoval=true)
    private List<Comment> comments=new ArrayList<>();
}
