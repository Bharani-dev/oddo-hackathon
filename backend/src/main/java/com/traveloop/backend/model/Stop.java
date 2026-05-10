package com.traveloop.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "stops")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "stops", "user"})
    private Trip trip;

    @Column(nullable = false)
    private String cityName;
    private String country;
    
    private LocalDate arrivalDate;
    private LocalDate departureDate;
    private Integer orderIndex;

    @OneToMany(mappedBy = "stop", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "stop"})
    private List<Activity> activities;
}
