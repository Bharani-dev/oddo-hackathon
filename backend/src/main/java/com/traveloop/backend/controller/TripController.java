package com.traveloop.backend.controller;

import com.traveloop.backend.model.Trip;
import com.traveloop.backend.model.AppUser;
import com.traveloop.backend.repository.TripRepository;
import com.traveloop.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Trip>> getUserTrips(@PathVariable Long userId) {
        return ResponseEntity.ok(tripRepository.findByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(@PathVariable Long id) {
        Optional<Trip> trip = tripRepository.findById(id);
        return trip.isPresent() ? ResponseEntity.ok(trip.get()) : ResponseEntity.notFound().build();
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createTrip(@PathVariable Long userId, @RequestBody Trip trip) {
        Optional<AppUser> user = userRepository.findById(userId);
        if (user.isPresent()) {
            trip.setUser(user.get());
            Trip saved = tripRepository.save(trip);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        tripRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
