package org.example.repository;

import org.example.model.Mood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodRepository extends JpaRepository<Mood,Integer> {
}
