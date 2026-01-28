package com.mentorlink.service;

import com.mentorlink.dto.AddAnswerRequest;
import com.mentorlink.dto.CreateQuestionRequest;
import com.mentorlink.dto.UpdateQuestionRequest;
import com.mentorlink.entity.Answer;
import com.mentorlink.entity.Question;
import com.mentorlink.entity.User;
import com.mentorlink.repository.QuestionRepository;
import com.mentorlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    
    /**
     * Get all questions with pagination and sorting
     */
    public Page<Question> getAllQuestions(int page, int limit, String sort) {
        Sort.Direction direction = sort.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String field = sort.replace("-", "");
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, field));
        return questionRepository.findAll(pageable);
    }
    
    /**
     * Get single question by ID
     */
    public Question getQuestionById(String id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }
    
    /**
     * Create a new question
     */
    public Question createQuestion(CreateQuestionRequest request, String userId) {
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setCategory(request.getCategory().toLowerCase());
        question.setAuthor(author);
        question.setTags(request.getTags());
        question.setUpvotes(0);
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        
        return questionRepository.save(question);
    }
    
    /**
     * Update an existing question
     */
    public Question updateQuestion(String id, UpdateQuestionRequest request, String userId) {
        Question question = getQuestionById(id);
        
        // Check if user is the author
        if (!question.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own questions");
        }
        
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setCategory(request.getCategory().toLowerCase());
        question.setUpdatedAt(LocalDateTime.now());
        
        return questionRepository.save(question);
    }
    
    /**
     * Delete a question
     */
    public void deleteQuestion(String id, String userId) {
        Question question = getQuestionById(id);
        
        // Check if user is the author
        if (!question.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own questions");
        }
        
        questionRepository.deleteById(id);
    }
    
    /**
     * Add an answer to a question
     */
    public Question addAnswer(String questionId, AddAnswerRequest request, String userId) {
        Question question = getQuestionById(questionId);
        User author = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Answer answer = new Answer();
        answer.setId(new ObjectId().toString());
        answer.setContent(request.getContent());
        answer.setAuthor(author);
        answer.setUpvotes(0);
        answer.setCreatedAt(LocalDateTime.now());
        answer.setUpdatedAt(LocalDateTime.now());
        
        question.getAnswers().add(answer);
        question.setUpdatedAt(LocalDateTime.now());
        
        return questionRepository.save(question);
    }
    
    /**
     * Upvote a question
     */
    public Question upvoteQuestion(String id, String userId) {
        Question question = getQuestionById(id);
        question.setUpvotes(question.getUpvotes() + 1);
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }
    
    /**
     * Get questions by category
     */
    public Page<Question> getQuestionsByCategory(String category, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findByCategory(category.toLowerCase(), pageable);
    }
    
    /**
     * Get questions by mentor/author
     */
    public Page<Question> getQuestionsByMentor(String mentorId, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return questionRepository.findByAuthorId(mentorId, pageable);
    }
    
    /**
     * Search questions by title and content
     */
    public Page<Question> searchQuestions(String query, String category, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        if (category != null && !category.isEmpty()) {
            return questionRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                query, query, pageable);
        }
        
        return questionRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            query, query, pageable);
    }
}
