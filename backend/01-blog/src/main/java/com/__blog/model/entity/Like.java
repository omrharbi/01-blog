package com.__blog.model.entity;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table
@Entity(name = "liked")
@Getter
@Setter
public class Like {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "liked")
    private boolean liked;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "post_id", nullable = true)
    private Post post;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = true)
    private Comment comment;

    @JsonIgnore
    @ManyToOne

    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public boolean isPostLiked() {
        return post != null;
    }

    public boolean isCommentLiked() {
        return comment != null;
    }
}
