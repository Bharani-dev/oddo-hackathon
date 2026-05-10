package com.traveloop.backend.repository;
import com.traveloop.backend.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStopIdOrderByStartTimeAsc(Long stopId);
}
