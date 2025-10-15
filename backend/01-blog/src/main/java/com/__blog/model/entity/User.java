package com.__blog.model.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import com.__blog.model.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table
@Entity(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "firstname", nullable = false)
    private String firstname;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "about", nullable = true)
    private String about;

    @Column(name = "date_of_birth")
    private Date date_of_birth;

    @Column(name = "username", nullable = true, unique = true)

    private String username;

    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "created_at", nullable = false) // corrected
    private Date create_at = new Date();

    @Column(name = "avatar", nullable = true)
    private String avatar;

    @OneToMany(mappedBy = "user_posts", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "subscriber_User", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Subscription> following = new ArrayList<>();

    // Users who follow this user
    @OneToMany(mappedBy = "subscribedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Subscription> followers = new ArrayList<>();

    @OneToMany(mappedBy = "reporter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Report> reportsSender = new ArrayList<>();

    @OneToMany(mappedBy = "reportedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Report> reportsReceived = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Notification> receiver = new ArrayList<>();

    @OneToMany(mappedBy = "triggerUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Notification> triggerUser = new ArrayList<>();

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private RefreshToken refreshToken;
    @JsonIgnore
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Roles role = Roles.USER;
;
}
