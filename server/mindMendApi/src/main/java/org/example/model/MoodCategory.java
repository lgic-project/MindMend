package org.example.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "mood_category", schema = "public")
public class MoodCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 150)
    @Column(name = "name", length = 150)
    private String name;

    @Column(name = "logo", length = Integer.MAX_VALUE)
    private String logo;

    @Size(max = 50)
    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "last_created_date")
    private Instant lastCreatedDate;

    @Column(name = "last_updated_date")
    private Instant lastUpdatedDate;

}