package org.example.service;

import org.example.beans.AccountResp;
import org.example.beans.ProfileReq;
import org.example.model.Account;
import org.example.model.Siteconfig;

import java.util.List;

public interface SiteConfigService {

    List<Siteconfig> getAllAdditionalInformation();

    Siteconfig getSiteInfoById(Integer id);

    Siteconfig saveSiteInfo(Siteconfig siteconfig);


    Siteconfig updateSiteInfo(Siteconfig siteconfig, Integer id);

    void deleteSiteInfo(Integer id);
}
