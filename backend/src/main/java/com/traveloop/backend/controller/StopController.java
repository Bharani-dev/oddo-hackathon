package com.traveloop.backend.controller;

import com.traveloop.backend.model.Stop;
import com.traveloop.backend.model.Trip;
import com.traveloop.backend.repository.StopRepository;
import com.traveloop.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/stops")
@CrossOrigin(origins = "*")
public class StopController {

    @Autowired
    private StopRepository stopRepository;
    @Autowired
    private TripRepository tripRepository;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Stop>> getTripStops(@PathVariable Long tripId) {
        return ResponseEntity.ok(stopRepository.findByTripIdOrderByOrderIndexAsc(tripId));
    }

    @PostMapping("/trip/{tripId}")
    public ResponseEntity<?> addStopToTrip(@PathVariable Long tripId, @RequestBody Stop stop) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            stop.setTrip(trip.get());
            Stop saved = stopRepository.save(stop);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().body("Trip not found");
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getStop(@PathVariable Long id) {
        Optional<Stop> stop = stopRepository.findById(id);
        return stop.isPresent() ? ResponseEntity.ok(stop.get()) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStop(@PathVariable Long id) {
        stopRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
