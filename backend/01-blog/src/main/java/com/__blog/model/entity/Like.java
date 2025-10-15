package com.__blog.model.entity;

import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Table
@Entity(name="liked")
@Data
public class Like {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "liked")
    private boolean liked;
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = true)
    private Post post_likes;

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = true)
    private Comment comment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public boolean isPostLiked() {
        return post_likes != null;
    }

    public boolean isCommentLiked() {
        return comment!=null;
    }
}
