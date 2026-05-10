package com.traveloop.backend.controller;

import com.traveloop.backend.model.ChecklistItem;
import com.traveloop.backend.model.Trip;
import com.traveloop.backend.repository.ChecklistItemRepository;
import com.traveloop.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/checklists")
@CrossOrigin(origins = "*")
public class ChecklistController {

    @Autowired
    private ChecklistItemRepository checklistRepository;
    @Autowired
    private TripRepository tripRepository;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ChecklistItem>> getTripChecklist(@PathVariable Long tripId) {
        return ResponseEntity.ok(checklistRepository.findByTripId(tripId));
    }

    @PostMapping("/trip/{tripId}")
    public ResponseEntity<?> addItem(@PathVariable Long tripId, @RequestBody ChecklistItem item) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            item.setTrip(trip.get());
            return ResponseEntity.ok(checklistRepository.save(item));
        }
        return ResponseEntity.badRequest().body("Trip not found");
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> togglePacked(@PathVariable Long id) {
        Optional<ChecklistItem> item = checklistRepository.findById(id);
        if (item.isPresent()) {
            ChecklistItem cl = item.get();
            cl.setIsPacked(!cl.getIsPacked());
            return ResponseEntity.ok(checklistRepository.save(cl));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        checklistRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
