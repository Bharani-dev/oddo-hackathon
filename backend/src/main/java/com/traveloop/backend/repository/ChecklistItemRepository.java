package com.traveloop.backend.repository;
import com.traveloop.backend.model.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
    List<ChecklistItem> findByTripId(Long tripId);
}
