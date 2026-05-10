package com.traveloop.backend.controller;

import com.traveloop.backend.model.AppUser;
import com.traveloop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        Optional<AppUser> user = userRepository.findById(id);
        return user.isPresent() ? ResponseEntity.ok(user.get()) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody AppUser updated) {
        Optional<AppUser> existing = userRepository.findById(id);
        if (existing.isPresent()) {
            AppUser user = existing.get();
            if (updated.getName() != null) user.setName(updated.getName());
            if (updated.getEmail() != null) user.setEmail(updated.getEmail());
            if (updated.getProfilePhoto() != null) user.setProfilePhoto(updated.getProfilePhoto());
            return ResponseEntity.ok(userRepository.save(user));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
