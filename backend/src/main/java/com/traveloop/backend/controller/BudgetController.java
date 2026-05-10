package com.traveloop.backend.controller;

import com.traveloop.backend.model.Activity;
import com.traveloop.backend.model.Stop;
import com.traveloop.backend.model.Trip;
import com.traveloop.backend.repository.ActivityRepository;
import com.traveloop.backend.repository.StopRepository;
import com.traveloop.backend.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private StopRepository stopRepository;
    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getBudgetSummary(@PathVariable Long tripId) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (!trip.isPresent()) return ResponseEntity.notFound().build();

        BigDecimal totalCost = BigDecimal.ZERO;
        List<Stop> stops = stopRepository.findByTripIdOrderByOrderIndexAsc(tripId);
        
        for(Stop stop : stops) {
            List<Activity> activities = activityRepository.findByStopIdOrderByStartTimeAsc(stop.getId());
            for(Activity act : activities) {
                if(act.getCost() != null) {
                    totalCost = totalCost.add(act.getCost());
                }
            }
        }
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("tripId", tripId);
        summary.put("totalCost", totalCost);
        return ResponseEntity.ok(summary);
    }
}
