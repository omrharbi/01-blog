package com.__blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
 
@SpringBootApplication(scanBasePackages = "com.__blog")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        // System.out.println("ApplicationContext has been initialized.");

        // // 2. كنطلبو الـ Bean ديالنا من الـ ApplicationContext بشكل يدوي (نادراً ما
        // كديرها هاكا في Spring Boot)
        // UserService myServiceBean = context.getBean(UserService.class);

        // // 3. كنستخدمو الـ Bean
        // System.out.println("Result from Bean: " + myServiceBean);
    }
}
