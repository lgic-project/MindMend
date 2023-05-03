package org.example.controller;

import org.example.beans.AccountResp;
import org.example.beans.ProfileReq;
import org.example.model.Account;
import org.example.model.Siteconfig;
import org.example.service.SiteConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/siteconfig")
public class SiteConfigController {

    @Autowired
    private SiteConfigService siteConfigService;

    @ResponseBody
    @GetMapping("")
    ResponseEntity<List<Siteconfig>> getAllSiteConfig(){

        return new ResponseEntity<>(siteConfigService.getAllAdditionalInformation(), HttpStatus.OK);
    }

    @ResponseBody
    @GetMapping("/{siteId}")
    ResponseEntity<Siteconfig> getSiteConfigById(@PathVariable Integer siteId){

        return new ResponseEntity<>(siteConfigService.getSiteInfoById(siteId), HttpStatus.OK);
    }

    @ResponseBody
    @PostMapping("")
    ResponseEntity<Siteconfig> saveSiteConfig(@RequestBody Siteconfig siteconfig){

        return new ResponseEntity<>(siteConfigService.saveSiteInfo(siteconfig), HttpStatus.OK);
    }

    @ResponseBody
    @PatchMapping("/{siteId}")
    ResponseEntity<Siteconfig> updateSiteConfig(@RequestBody Siteconfig siteconfig, @PathVariable Integer siteId){

        return new ResponseEntity<>(siteConfigService.updateSiteInfo(siteconfig, siteId), HttpStatus.OK);
    }


    @ResponseBody
    @DeleteMapping ("/{siteId}")
    public void deleteSiteConfig( @PathVariable Integer siteId){
        siteConfigService.deleteSiteInfo(siteId);
    }
}
