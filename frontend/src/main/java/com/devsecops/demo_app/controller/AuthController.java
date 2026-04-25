package com.devsecops.demo_app.controller;

import com.devsecops.demo_app.model.User;
import com.devsecops.demo_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    // ⚠️ Login vulnérable intentionnellement (pour DAST/ZAP)
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        // ⚠️ Pas de hashage du mot de passe (vulnérabilité intentionnelle)
        // ⚠️ Pas de validation des entrées (vulnérabilité intentionnelle)
        return userService.findByUsername(username)
                .map(user -> {
                    Map<String, String> response = new HashMap<>();
                    // ⚠️ Token hardcodé (vulnérabilité intentionnelle)
                    response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake");
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        // ⚠️ Mot de passe stocké en clair (vulnérabilité intentionnelle)
        User saved = userService.createUser(user);
        return ResponseEntity.ok(saved);
    }
}