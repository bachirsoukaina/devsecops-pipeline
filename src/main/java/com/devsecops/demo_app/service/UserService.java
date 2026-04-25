package com.devsecops.demo_app.service;

import com.devsecops.demo_app.model.User;
import com.devsecops.demo_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Récupérer tous les users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Récupérer un user par id
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Créer un user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Supprimer un user
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Chercher par username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}