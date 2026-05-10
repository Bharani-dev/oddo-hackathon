package com.traveloop.backend.repository;
import com.traveloop.backend.model.TripNote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripNoteRepository extends JpaRepository<TripNote, Long> {
    List<TripNote> findByTripIdOrderByCreatedAtDesc(Long tripId);
}
