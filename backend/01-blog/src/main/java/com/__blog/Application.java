package com.__blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.__blog.model.dto.response.UserRepo;
import com.__blog.model.entity.User;

@SpringBootApplication
public class Application implements CommandLineRunner {
	@Autowired
	UserRepo repouser;
    public static void main(String[] args) {
        System.out.println("helleo");
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args)  {
        User user = new User(5, "sofyan  test", "test");
        repouser.save(user);
    }

}
