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

    // ============================================
    // ⚠️ LOGIN VULNÉRABLE (pour DAST/ZAP)
    // ============================================
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        // ⚠️ Pas de hashage du mot de passe
        // ⚠️ Pas de validation des entrées
        return userService.findByUsername(username)
                .map(user -> {
                    Map<String, String> response = new HashMap<>();
                    // ⚠️ Token hardcodé
                    response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake");
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    // ============================================
    // ⚠️ REGISTER - Mot de passe en clair
    // ============================================
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        // ⚠️ Mot de passe stocké en clair
        User saved = userService.createUser(user);
        return ResponseEntity.ok(saved);
    }

    // ============================================
    // ⚠️ SQL INJECTION - SonarQube détectera
    // ============================================
    @GetMapping("/login-sql")
    public ResponseEntity<User> loginWithSqlInjection(
            @RequestParam String username,
            @RequestParam String password) {
        
        // ⚠️ Appel direct à la méthode vulnérable
        // ⚠️ Utilise findByUsernameInjection qui contient la faille SQL
        return userService.findByUsernameInjection(username)
                .map(user -> {
                    // ⚠️ Comparaison de mot de passe en clair
                    if (user.getPassword().equals(password)) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(401).build();
                })
                .orElse(ResponseEntity.status(401).build());
    }

    // ============================================
    // ⚠️ SQL INJECTION VERSION 2 (pour DAST/ZAP)
    // ============================================
    @GetMapping("/login-vulnerable")
    public ResponseEntity<User> loginVulnerable(
            @RequestParam String username,
            @RequestParam String password) {
        
        // ⚠️ Version vulnérable sans injection mais avec mot de passe en clair
        return userService.findByUsername(username)
                .map(user -> {
                    if (user.getPassword().equals(password)) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(401).build();
                })
                .orElse(ResponseEntity.status(401).build());
    }
}