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

    private static final String AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
    private static final String AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
    private static final String GITHUB_TOKEN = "ghp_16C7e42F292c6912E7710c838347Ae298246";

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        return userService.findByUsername(username)
                .map(user -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake");
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        userService.createUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User created successfully");
        response.put("username", user.getUsername());
        return ResponseEntity.ok(response);
    }
}