package org.example.serviceimpl;

import org.example.beans.AccountResp;
import org.example.beans.ProfileReq;
import org.example.exception.NoMatchException;
import org.example.exception.NotFoundException;
import org.example.model.Account;
import org.example.model.Address;
import org.example.model.Profile;
import org.example.repository.AccountRepository;
import org.example.repository.AddressRepository;
import org.example.repository.ProfileRepository;
import org.example.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public List<AccountResp> getAllAccountDetails() {
        List<AccountResp> accounts = profileRepository.getAllAccountDetails();
        if (accounts.isEmpty()){
            new NotFoundException("no accounts data found");
        }
        return accounts;
    }

    @Override
    public AccountResp getAccountDetailById(Integer id) {
        AccountResp account = profileRepository.getAccountDetailsById(id);
        if (account ==null){
            new NotFoundException("no accounts data found");
        }
        return account;
    }

    @Override
    public Account saveAccountInfo(Account account) {
        account.setCreatedAt(Instant.now());
        account.setIsActive("1");
        account.setSlug(account.getUserName());
        accountRepository.save(account);
        return account;
    }

    @Override
    public AccountResp updateProfileDetails(Integer id, ProfileReq profileReq) {
        Profile existingProfile = profileRepository.getProfileDetailsById(id);
        if (existingProfile == null){
            new NoMatchException("Account with account id:"+id +" not found");
        }

        //updating profile info
        existingProfile.setGender(profileReq.getGender());
        existingProfile.setEmail(profileReq.getEmail());
        existingProfile.setUpdatedAt(Instant.now());
        existingProfile.setIsActive("1");
        existingProfile.setImage(profileReq.getImage());
        existingProfile.setFirstName(profileReq.getFirstName());
        existingProfile.setPhone(profileReq.getPhone());
        existingProfile.setLastName(profileReq.getLastName());
       Profile profile= profileRepository.save(existingProfile);

        //updating account info
        Account account = new Account();
        account.setId(profileReq.getAccountId());
        account.setUpdatedAt(Instant.now());
        account.setUserName(profileReq.getUsername());
        account.setSlug(profileReq.getUsername());
        account.setIsActive("1");
        Account account1 = accountRepository.save(account);

        //updating address info
        Address address = new Address();
        address.setId(profileReq.getAddressId());
        address.setCity(profileReq.getCity());
        address.setState(profileReq.getState());
        address.setCountry(profileReq.getCountry());
        address.setIsActive("1");
        address.setUpdatedAt(Instant.now());
        address.setStreet(profileReq.getStreet());
        address.setZipCode(profileReq.getZipCode());
        Address address1 =addressRepository.save(address);

        AccountResp accountResp = new AccountResp();
        accountResp.setProfileId(profile.getId());
        accountResp.setFirstName(profile.getFirstName());
        accountResp.setLastName(profile.getLastName());
        accountResp.setEmail(profile.getEmail());
        accountResp.setImage(profile.getImage());
        accountResp.setGender(profile.getGender());
        accountResp.setPhone(profile.getPhone());
        accountResp.setUsername(account1.getUserName());
        accountResp.setState(address1.getState());
        accountResp.setAddressId(address1.getId());
        accountResp.setAccountId(account1.getId());
        accountResp.setStreet(address1.getStreet());
        accountResp.setCity(address1.getCity());
        accountResp.setCountry(address1.getCountry());
        accountResp.setZipCode(address1.getZipCode());

        return accountResp;



    }

    @Override
    public Account updateAccount(Account account, Integer id) {
        Account existingAccount = accountRepository.getAccountDetailsById(id);

        if (existingAccount == null){
            new NoMatchException("Account with account id:"+id +" not found");
        }
        existingAccount.setUpdatedAt(Instant.now());
        existingAccount.setIsActive("1");
        existingAccount.setSlug(account.getUserName());
        existingAccount.setUserName(account.getUserName());
        accountRepository.save(existingAccount);
        return existingAccount;
    }

    @Override
    public void deleteAccount(Integer id) {
        Account existingAccount = accountRepository.getAccountDetailsById(id);

        if (existingAccount == null){
            new NoMatchException("Account with account id:"+id +" not found");
        }

        //assigning 2 - for delete
        existingAccount.setIsActive("2");
        accountRepository.save(existingAccount);


    }
}
