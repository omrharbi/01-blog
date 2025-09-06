package com.__blog.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "users")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column
    private Integer id;
    @Column
    private String email;
    @Column
    private String password;
    @Column
    private String fristname;
    @Column
    private String lastname;
    // @Column
    // private String about;
    // @Column
    // private String profile_type;
    // @Column
    // private Date date_of_birth;
    // @Column
    // private String username;
    // @Column
    // private String status;
    // @Column
    // private Date Create_at;
    // @Column
    // private String avatar;

}
