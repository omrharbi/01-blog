package com.__blog.model.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.__blog.model.enums.Roles;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "users")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "firstname", nullable = false)
    private String fristname;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "about", nullable = true)
    private String about;

    // @Column(name = "profile_type", nullable = false)
    // private String profile_type;

    @Column(name = "date_of_birth", nullable = false)
    private Date date_of_birth;

    @Column(name = "username", nullable = true, unique = true)

    private String username;

    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "created_at", nullable = false) // corrected
    private Date create_at = new Date();

    @Column(name = "avatar", nullable = true)
    private String avatar;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "subscriber_User", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> following = new ArrayList<>();

    // Users who follow this user
    @OneToMany(mappedBy = "subscribedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subscription> followers = new ArrayList<>();

    @OneToMany(mappedBy = "reporter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> reportsSender = new ArrayList<>();

    @OneToMany(mappedBy = "reportedUser", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<Report> reportsReceived = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> receiver = new ArrayList<>();

    @OneToMany(mappedBy = "triggerUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> triggerUser = new ArrayList<>();

    @OneToMany(mappedBy = "sender_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chat> sender_id = new ArrayList<>();

    @OneToMany(mappedBy = "receiver_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chat> receiver_id = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Roles role=Roles.USER;;
}
