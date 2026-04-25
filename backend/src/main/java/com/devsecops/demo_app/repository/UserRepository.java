package com.devsecops.demo_app.repository;

import com.devsecops.demo_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Recherche normale
    Optional<User> findByUsername(String username);

    // ⚠️ Faille SQL intentionnelle (pour SAST/SonarQube)
    @Query(value = "SELECT * FROM users WHERE username = :username OR '1'='1'",
            nativeQuery = true)
    Optional<User> findByUsernameVulnerable(String username);
}