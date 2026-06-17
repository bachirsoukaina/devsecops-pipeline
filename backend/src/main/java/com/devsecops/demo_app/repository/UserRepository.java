package com.devsecops.demo_app.repository;

import com.devsecops.demo_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    // Injection SQL intentionnelle via concatenation
    @Query(value = "SELECT * FROM users WHERE username = :username OR '1'='1'", nativeQuery = true)
    Optional<User> findByUsernameVulnerable(String username);

    // Methode vulnerable pour SonarQube S3649
    default Optional<User> findByUsernameUnsafe(String username) {
        return findByUsernameVulnerable(username);
    }
}