package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.User;
import com.Event.ticketing.app.api.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepo userRepository;

    // GET all users
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    // Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Email is already in use.");
        }
        // Encode password before saving
        String encodedPassword = Base64.getEncoder().encodeToString(user.getPassword().getBytes(StandardCharsets.UTF_8));
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            String storedPassword = existingUser.get().getPassword();
            String decodedPassword = new String(Base64.getDecoder().decode(storedPassword), StandardCharsets.UTF_8);

            if (decodedPassword.equals(user.getPassword())) {
                User foundUser = existingUser.get();
                return ResponseEntity.ok(foundUser);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }


    // Forgot Password Endpoint
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email, @RequestParam String newPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User existingUser = user.get();
            // Encode new password before saving
            String encodedPassword = Base64.getEncoder().encodeToString(newPassword.getBytes(StandardCharsets.UTF_8));
            existingUser.setPassword(encodedPassword);
            userRepository.save(existingUser); // Save the updated user
            return ResponseEntity.ok("Password updated successfully.");
        } else {
            return ResponseEntity.status(404).body("Email not found.");
        }
    }

    // Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    // Update User
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (!existingUserOpt.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User existingUser = existingUserOpt.get();

        // Update only the fields that are provided in the request body
        if (updatedUser.getFirstname() != null) {
            existingUser.setFirstname(updatedUser.getFirstname());
        }
        if (updatedUser.getLastname() != null) {
            existingUser.setLastname(updatedUser.getLastname());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            // If a new password is provided, encode it before saving
            String encodedPassword = Base64.getEncoder().encodeToString(updatedUser.getPassword().getBytes(StandardCharsets.UTF_8));
            existingUser.setPassword(encodedPassword);
        }

        userRepository.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }


    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body("User not found.");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
