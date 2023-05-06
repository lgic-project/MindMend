package org.example.repository;

import org.example.beans.AccountResp;
import org.example.model.Account;
import org.example.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile,Integer> {

//    @Query("SELECT new org.example.beans.AccountResp(a.userName,a.userId,a.id,p.id,addr.id,p.lastName,p.lastName,p.email,p.gender,p.phone,p.image,addr.country,addr.city,addr.zipCode,addr.state,addr.street) FROM Profile p INNER JOIN AccountProfile ap ON p.id = ap.profileId INNER JOIN Account a ON ap.accountId = a.id INNER JOIN ProfileAddress padd ON ap.id = padd.accountProfileId INNER JOIN Address addr ON padd.addressId = addr.id Where a.isActive = '1' and p.isActive = '1' ")
//    List<AccountResp> getAllAccountDetails();
//
//    @Query("SELECT new org.example.beans.AccountResp(a.userName,a.userId,a.id,p.id,addr.id,p.firstName,p.lastName,p.email,p.gender,p.phone,p.image,addr.country,addr.city,addr.zipCode,addr.state,addr.street) FROM Profile p INNER JOIN AccountProfile ap ON p.id = ap.profileId INNER JOIN Account a ON ap.accountId = a.id INNER JOIN ProfileAddress padd ON ap.id = padd.accountProfileId INNER JOIN Address addr ON padd.addressId = addr.id Where a.isActive = '1' and p.isActive = '1' AND p.id =?1 ")
//    AccountResp getAccountDetailsById(Integer id);

//    @Query(nativeQuery = true,value = "select * from profile where id = ?1")
//    Profile getProfileDetailsById(Integer id);

}
