package org.example.repository;

import org.example.model.Account;
import org.example.model.Siteconfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SiteConfigRepository extends JpaRepository<Siteconfig,Integer> {

    @Query(nativeQuery = true,value = "select * from siteconfig where id = ?1 AND status = '1'")
    Siteconfig findSiteInfoById(Integer id);

    @Query(nativeQuery = true,value = "select * from siteconfig where status = '1'")
    List<Siteconfig> findAllSiteInfo();
}
