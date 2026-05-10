package com.traveloop.backend.controller;

import com.traveloop.backend.model.TripNote;
import com.traveloop.backend.model.Trip;
import com.traveloop.backend.repository.TripNoteRepository;
import com.traveloop.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class TripNoteController {

    @Autowired
    private TripNoteRepository noteRepository;
    @Autowired
    private TripRepository tripRepository;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<TripNote>> getTripNotes(@PathVariable Long tripId) {
        return ResponseEntity.ok(noteRepository.findByTripIdOrderByCreatedAtDesc(tripId));
    }

    @PostMapping("/trip/{tripId}")
    public ResponseEntity<?> addNote(@PathVariable Long tripId, @RequestBody TripNote note) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            note.setTrip(trip.get());
            if(note.getCreatedAt() == null) note.setCreatedAt(java.time.LocalDateTime.now());
            return ResponseEntity.ok(noteRepository.save(note));
        }
        return ResponseEntity.badRequest().body("Trip not found");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id, @RequestBody TripNote updated) {
        Optional<TripNote> existing = noteRepository.findById(id);
        if (existing.isPresent()) {
            TripNote note = existing.get();
            note.setContent(updated.getContent());
            return ResponseEntity.ok(noteRepository.save(note));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
