package org.example.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "credentials", schema = "public")
public class Credential {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "credentials_type", nullable = false)
    private String credentialsType;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Size(max = 255)
    @NotNull
    @Column(name = "k", nullable = false)
    private String k;

    @Size(max = 255)
    @NotNull
    @Column(name = "e", nullable = false)
    private String e;

    @Size(max = 255)
    @NotNull
    @Column(name = "v", nullable = false)
    private String v;

    @Size(max = 255)
    @NotNull
    @Column(name = "is_active", nullable = false)
    private String isActive;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @Column(name = "deleted_at", nullable = false)
    private Instant deletedAt;

    @NotNull
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}