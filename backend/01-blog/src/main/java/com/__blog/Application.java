package com.__blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.__blog")
public class Application  {
    public static void main(String[] args) {
         SpringApplication.run(Application.class, args);
    }
}
