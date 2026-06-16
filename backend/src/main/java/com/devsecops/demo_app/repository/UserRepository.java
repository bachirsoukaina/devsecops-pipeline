package com.devsecops.demo_app.repository;

import com.devsecops.demo_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Recherche normale sécurisée
    Optional<User> findByUsername(String username);

    // ⚠️ VRAIE INJECTION SQL (SonarQube détectera)
    @Query(value = "SELECT * FROM users WHERE username = '" + "admin' OR '1'='1" + "'", nativeQuery = true)
    Optional<User> findByUsernameVulnerable();

    // ⚠️ AUTRE INJECTION SQL avec paramètre
    @Query(value = "SELECT * FROM users WHERE username = :username OR 1=1", nativeQuery = true)
    Optional<User> findByUsernameInjection(@Param("username") String username);
}