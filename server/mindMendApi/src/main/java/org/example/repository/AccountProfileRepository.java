package org.example.repository;

import org.example.model.AccountProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountProfileRepository extends JpaRepository<AccountProfile,Integer> {
}
