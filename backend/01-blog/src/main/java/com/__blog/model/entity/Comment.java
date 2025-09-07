package com.__blog.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "comment")
@Entity
@Data
public class Comment {
    @Id 
    private Integer id;
    private  String content;
    @ManyToOne
    @JoinColumn(name="post_id",nullable=false)
    private Post post;
    
    @ManyToOne
    @JoinColumn(name="user_id",nullable=false)
    private User user;
}
