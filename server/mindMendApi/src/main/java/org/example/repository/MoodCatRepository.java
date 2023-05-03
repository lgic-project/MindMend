package org.example.repository;

import org.example.model.MoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodCatRepository extends JpaRepository<MoodCategory, Integer> {
}
