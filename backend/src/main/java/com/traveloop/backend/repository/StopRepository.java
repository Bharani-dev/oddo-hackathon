package com.traveloop.backend.repository;
import com.traveloop.backend.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StopRepository extends JpaRepository<Stop, Long> {
    List<Stop> findByTripIdOrderByOrderIndexAsc(Long tripId);
}
