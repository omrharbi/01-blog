package com.__blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.__blog.model.entity.User;
import com.__blog.service.UserService;

@SpringBootApplication
public class Application implements CommandLineRunner {

    @Autowired
    UserService userService;

    public static void main(String[] args) {
        System.out.println("helleo");
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) {
        User user = new User(5, "sofyan  test", "test", "omar", "rharbi");
        user = userService.save_User(user);
        System.out.println(user);
    }

}
