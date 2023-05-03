package org.example.repository;

import org.example.model.ProfileAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileAddressRepository extends JpaRepository<ProfileAddress,Integer> {
}
