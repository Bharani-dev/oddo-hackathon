package com.traveloop.backend.controller;

import com.traveloop.backend.model.Activity;
import com.traveloop.backend.model.Stop;
import com.traveloop.backend.repository.ActivityRepository;
import com.traveloop.backend.repository.StopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private StopRepository stopRepository;

    @GetMapping("/stop/{stopId}")
    public ResponseEntity<List<Activity>> getStopActivities(@PathVariable Long stopId) {
        return ResponseEntity.ok(activityRepository.findByStopIdOrderByStartTimeAsc(stopId));
    }

    @PostMapping("/stop/{stopId}")
    public ResponseEntity<?> addActivityToStop(@PathVariable Long stopId, @RequestBody Activity activity) {
        Optional<Stop> stop = stopRepository.findById(stopId);
        if (stop.isPresent()) {
            activity.setStop(stop.get());
            Activity saved = activityRepository.save(activity);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.badRequest().body("Stop not found");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        activityRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
