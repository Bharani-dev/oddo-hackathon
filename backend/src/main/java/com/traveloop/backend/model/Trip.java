package com.traveloop.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "trips", "passwordHash"})
    private AppUser user;

    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private String coverPhotoUrl;
    
    @Column(nullable = false)
    private boolean isPublic = false;
    
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "trip"})
    private List<Stop> stops;
}
