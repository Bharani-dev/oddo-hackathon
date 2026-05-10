package com.traveloop.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "activities", "trip"})
    private Stop stop;

    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String type;
    private BigDecimal cost;
    private LocalTime startTime;
    private Integer durationMinutes;
}
