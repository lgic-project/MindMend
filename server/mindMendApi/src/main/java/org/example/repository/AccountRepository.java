package org.example.repository;

import org.example.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query(nativeQuery = true,value = "select * from account where id = ?1")
    Account getAccountDetailsById(Integer id);
}
