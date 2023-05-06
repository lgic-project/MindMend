//package org.example.controller;
//
//import org.example.beans.AccountResp;
//import org.example.beans.ProfileReq;
//import org.example.model.Account;
//import org.example.service.AuthenticationService;
//import org.example.service.ProfileService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.repository.query.Param;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@Controller
//@RequestMapping("api/profile")
//public class ProfileController {
//
//
//    @Autowired
//    private ProfileService profileService;
//
////    @ResponseBody
////    @GetMapping("")
////    ResponseEntity<List<AccountResp>> getAllAccountDetails(){
////
////        return new ResponseEntity<>(profileService.getAllAccountDetails(), HttpStatus.OK);
////    }
////
////    @ResponseBody
////    @GetMapping("/{accId}")
////    ResponseEntity<AccountResp> getAccountDetailById(@PathVariable Integer accId){
////
////        return new ResponseEntity<>(profileService.getAccountDetailById(accId), HttpStatus.OK);
////    }
//
//    @ResponseBody
//    @PostMapping("/account")
//    ResponseEntity<Account> saveAccount(@RequestBody Account account){
//
//        return new ResponseEntity<>(profileService.saveAccountInfo(account), HttpStatus.OK);
//    }
//
//    @ResponseBody
//    @PatchMapping("/{profileId}")
//    ResponseEntity<AccountResp> updateProfile(@RequestBody ProfileReq profileReq, @PathVariable Integer profileId){
//
//        return new ResponseEntity<>(profileService.updateProfileDetails(profileId, profileReq), HttpStatus.OK);
//    }
//
//    @ResponseBody
//    @PatchMapping("/{accId}")
//    ResponseEntity<Account> updateAccount(@RequestBody Account account, @PathVariable Integer accId){
//
//        return new ResponseEntity<>(profileService.updateAccount(account, accId), HttpStatus.OK);
//    }
//
//    @ResponseBody
//    @DeleteMapping ("/{accId}")
//    public void deleteAccount( @PathVariable Integer accId){
//        profileService.deleteAccount(accId);
//    }
//}
