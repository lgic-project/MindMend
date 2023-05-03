package org.example.service;

import org.example.beans.MoodReq;
import org.example.model.Mood;

public interface MoodService {

 Mood saveUserMood(MoodReq moodReq);
}
