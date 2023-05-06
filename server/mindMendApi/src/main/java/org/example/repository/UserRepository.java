package org.example.repository;

import org.example.model.Account;
import org.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer> {

//    @Query(nativeQuery = true,value = "select * from user where email = ?1")
//    User getUserById(String email);
}
