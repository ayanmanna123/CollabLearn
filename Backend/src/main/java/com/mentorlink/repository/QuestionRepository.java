package com.mentorlink.repository;

import com.mentorlink.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    
    Page<Question> findAll(Pageable pageable);
    
    Page<Question> findByCategory(String category, Pageable pageable);
    
    Page<Question> findByAuthorId(String authorId, Pageable pageable);
    
    Page<Question> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
        String title, String content, Pageable pageable);
    
    List<Question> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCaseAndCategory(
        String title, String content, String category);
}
