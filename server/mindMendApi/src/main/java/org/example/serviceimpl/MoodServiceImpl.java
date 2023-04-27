package org.example.serviceimpl;

import org.example.beans.MoodReq;
import org.example.model.Mood;
import org.example.repository.MoodRepository;
import org.example.service.MoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class MoodServiceImpl implements MoodService {
    @Autowired
    private MoodRepository moodRepository;

    @Override
    public Mood saveUserMood(MoodReq moodReq) {
        Mood mood = new Mood();
        mood.setUserId(moodReq.getUserId());
        mood.setMoodId(moodReq.getMoodId());
        mood.setLastCreatedDate(Instant.now());
        return moodRepository.save(mood);
    }
}
