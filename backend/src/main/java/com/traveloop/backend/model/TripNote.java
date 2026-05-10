package com.traveloop.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "stops", "user"})
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "activities", "trip"})
    private Stop stop;

    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
