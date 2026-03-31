package com.smartagri.controller;

import com.smartagri.dto.LoginRequest;
import com.smartagri.entity.User;
import com.smartagri.repository.UserRepository;
import com.smartagri.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> user = userRepository.findByUsername(request.getUsername());

        if (user.isPresent() && user.get().getPassword().equals(request.getPassword())) {
            String token = JwtUtil.generateToken(request.getUsername());
            String role = user.get().getRole();
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", role,
                    "username", request.getUsername()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
    }

    // ✅ SIGNUP (farmer registers themselves)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Username already exists"));
        }
        newUser.setRole("FARMER");
        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(Map.of(
                "message", "Registered successfully",
                "id", saved.getId(),
                "username", saved.getUsername()
        ));
    }

    // ✅ SEED admin on first run (call once: GET /auth/seed)
    @GetMapping("/seed")
    public String seed() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            return "Admin seeded!";
        }
        return "Admin already exists.";
    }
}