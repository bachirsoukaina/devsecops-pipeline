package com.devsecops.demo_app.config;

import com.devsecops.demo_app.model.User;
import com.devsecops.demo_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin123");
        admin.setEmail("admin@devsecops.com");
        admin.setRole("ADMIN");
        userRepository.save(admin);

        User john = new User();
        john.setUsername("john");
        john.setPassword("password123");
        john.setEmail("john@devsecops.com");
        john.setRole("USER");
        userRepository.save(john);

        User jane = new User();
        jane.setUsername("jane");
        jane.setPassword("jane123");
        jane.setEmail("jane@devsecops.com");
        jane.setRole("USER");
        userRepository.save(jane);

        System.out.println("✅ Données initialisées avec succès");
    }
}