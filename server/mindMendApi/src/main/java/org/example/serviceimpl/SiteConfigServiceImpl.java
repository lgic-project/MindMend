package org.example.serviceimpl;

import org.example.beans.AccountResp;
import org.example.exception.NoMatchException;
import org.example.exception.NotFoundException;
import org.example.model.Account;
import org.example.model.Siteconfig;
import org.example.repository.SiteConfigRepository;
import org.example.service.SiteConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SiteConfigServiceImpl implements SiteConfigService {
    @Autowired
    private SiteConfigRepository siteConfigRepository;

    @Override
    public List<Siteconfig> getAllAdditionalInformation() {
        List<Siteconfig> siteconfigs = siteConfigRepository.findAllSiteInfo();
        if (siteconfigs.isEmpty()){
            new NotFoundException("no site config data found");
        }
        return siteconfigs;
    }

    @Override
    public Siteconfig getSiteInfoById(Integer id) {
        Siteconfig siteconfig = siteConfigRepository.findSiteInfoById(id);
        if (siteconfig ==null){
            new NotFoundException("no site config data found");
        }
        return siteconfig;
    }

    @Override
    public Siteconfig saveSiteInfo(Siteconfig siteconfig) {
        siteconfig.setStatus("1");
        siteconfig.setCreatedAt(Instant.now());
       return siteConfigRepository.save(siteconfig);

    }

    @Override
    public Siteconfig updateSiteInfo(Siteconfig siteconfig, Integer id) {
        Siteconfig existingSite = siteConfigRepository.findSiteInfoById(id);
        if (existingSite ==null){
            new NotFoundException("no site config data found");
        }
        existingSite.setStatus("1");
        existingSite.setUpdatedAt(Instant.now());
        existingSite.setName(siteconfig.getName());
        existingSite.setSiteKey(siteconfig.getSiteKey());
        existingSite.setSiteValue(siteconfig.getSiteValue());
        existingSite.setUserId(siteconfig.getUserId());
        return  siteConfigRepository.save(existingSite);
    }

    @Override
    public void deleteSiteInfo(Integer id) {
        Siteconfig siteconfig = siteConfigRepository.findSiteInfoById(id);

        if (siteconfig == null){
            new NoMatchException("Site info with id:"+id +" not found");
        }

        //assigning 2 - for delete
        siteconfig.setStatus("1");
        siteConfigRepository.save(siteconfig);



    }
}
