//package org.example.serviceimpl;
//
//import edu.stanford.nlp.ling.CoreAnnotations;
//import edu.stanford.nlp.pipeline.Annotation;
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
//import edu.stanford.nlp.util.CoreMap;
//import org.example.service.SentimentAnalysisService;
//import org.springframework.stereotype.Service;
//
//import java.util.Properties;
//
//@Service
//public class SentimentAnalysisServiceImpl implements SentimentAnalysisService {
////    private final StanfordCoreNLP pipeline;
////
////    public SentimentAnalysisServiceImpl() {
////        Properties properties = new Properties();
////        properties.setProperty("annotators", "tokenize, ssplit, parse, sentiment");
////        this.pipeline = new StanfordCoreNLP(properties);
////    }
//
////    @Override
////    public int getSentimentScore(String text) {
////        int sentimentScore = 0;
////        if (text != null && !text.isEmpty()) {
////            Annotation annotation = pipeline.process(text);
////            for (CoreMap sentence : annotation.get(CoreAnnotations.SentencesAnnotation.class)) {
////                sentimentScore += sentence.get(SentimentCoreAnnotations.SentimentClass.class).equals("Positive") ? 1 : -1;
////            }
////        }
////        return sentimentScore;
////    }
//}
