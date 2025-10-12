package com.__blog.model.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "posts")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name = "title")
    private String title;

    @Column(columnDefinition = "TEXT", name = "excerpt")
    private String excerpt; // Raw markdown content

    @Column(columnDefinition = "TEXT", name = "content")
    private String content; // Raw markdown content
    @Column(columnDefinition = "TEXT", name = "html_content")
    private String htmlContent; // Converted HTML content

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user_posts;

    @OneToMany(mappedBy = "post_comments", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "post_likes", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Like> likes = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    // @OneToMany(fetch = FetchType.EAGER, mappedBy = "post")
    @OrderBy("displayOrder ASC")
    private Set<Media> medias = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Tags> tags = new HashSet<>();

    public void addMedia(Media media) {
        medias.add(media);
        media.setPost(this);
    }

    public void removeMedia(Media media) {
        medias.remove(media);
        media.setPost(null);
    }

    public void addTag(Tags tag) {
        tags.add(tag);
        tag.setPost(this);
    }

    public void removeTag(Tags tag) {
        tags.remove(tag);
        tag.setPost(null);
    }
}
