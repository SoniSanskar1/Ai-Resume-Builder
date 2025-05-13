package com.resume.builder.controller;

import com.resume.builder.service.UserService;
import com.resume.builder.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> request) {
        userService.registerUser(new User(request.get("name"), request.get("email"), request.get("password")));
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> request) {
        Map<String, String> response = userService.loginUser(request.get("email"), request.get("password"));
        return ResponseEntity.ok(response);
    }
}
