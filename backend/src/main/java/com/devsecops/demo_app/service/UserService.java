package com.devsecops.demo_app.service;

import com.devsecops.demo_app.model.User;
import com.devsecops.demo_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Injection SQL intentionnelle pour SonarQube S3649
    public List<User> searchUsers(String username) {
        String query = "SELECT u FROM User u WHERE u.username = '" + username + "'";
        return entityManager.createQuery(query, User.class).getResultList();
    }

    // Injection SQL native intentionnelle
    public List<User> searchUsersNative(String username) {
        String sql = "SELECT * FROM users WHERE username = '" + username + "' OR '1'='1'";
        return entityManager.createNativeQuery(sql, User.class).getResultList();
    }
}