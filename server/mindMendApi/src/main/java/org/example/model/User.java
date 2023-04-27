package org.example.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "\"user\"", schema = "public")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @Column(name = "email", length = 50)
    private String email;

    @Size(max = 50)
    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "last_created_date")
    private Instant lastCreatedDate;

    @Column(name = "last_updated_date")
    private Instant lastUpdatedDate;

    @Size(max = 150)
    @Column(name = "last_updated_by", length = 150)
    private String lastUpdatedBy;

}