package org.example.serviceimpl;

import org.example.beans.RegisterReq;
import org.example.exception.UserAlreadyExistException;
import org.example.model.Account;
import org.example.model.Credential;
import org.example.model.User;
import org.example.repository.AccountRepository;
import org.example.repository.CredentialRepository;
import org.example.repository.UserRepository;
import org.example.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public Account registerNewUser(RegisterReq reg) {
        User user = userRepository.getUserById(reg.getEmail());

        //saving user email in user table
        if (user!= null){
            new UserAlreadyExistException("User with email"+reg.getEmail()+" already exist");

        }
        User newUser = new User();
        newUser.setEmail(reg.getEmail());
        newUser.setStatus("0");
        newUser.setLastCreatedDate(Instant.now());
        newUser.setLastUpdatedBy("Admin");
        User user1 = userRepository.save(newUser);

        //saving username in account table
        Account account = new Account();
        account.setSlug(reg.getUsername());
        account.setUserName(reg.getUsername());
        account.setIsActive("0");
        account.setCreatedAt(Instant.now());
        account.setUserId(user1.getId());
        accountRepository.save(account);

        //saving password in account table

        //Encoding password using BcryptPasswordEncoder()
        String encryptedPassword = passwordEncoder.encode(reg.getPassword());
        Credential credential = new Credential();
        credential.setCredentialsType("password");
        credential.setK(encryptedPassword);
        credential.setCreatedAt(Instant.now());
        credential.setIsActive("Inactive");
        credential.setUserId(user1.getId());
        credentialRepository.save(credential);

        return account;

    }
}
