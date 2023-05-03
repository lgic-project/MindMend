package org.example.controller;

import org.example.beans.RegisterReq;
import org.example.model.Account;
import org.example.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @ResponseBody
    @PostMapping("/login")
    ResponseEntity<String> login(){

        return new ResponseEntity<>("login", HttpStatus.OK);
    }

    @ResponseBody
    @PostMapping("/register")
    ResponseEntity<Account> register(@RequestBody RegisterReq req){

        return new ResponseEntity<>(authenticationService.registerNewUser(req), HttpStatus.OK);
    }
}
