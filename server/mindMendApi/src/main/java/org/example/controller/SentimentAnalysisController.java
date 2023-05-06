package org.example.controller;

import org.example.service.SentimentAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("api/sentiment")
public class SentimentAnalysisController {

//    @Autowired
//    private SentimentAnalysisService sentimentAnalysisService;
//
//    @PostMapping("")
//    @ResponseBody
//    public ResponseEntity<Integer> getSentimentScore(@RequestBody String text) {
//        int sentimentScore = sentimentAnalysisService.getSentimentScore(text);
//        return ResponseEntity.ok(sentimentScore);
//    }

    @GetMapping("")
    @ResponseBody
    public String text(){
        return "hi";
    }
}
