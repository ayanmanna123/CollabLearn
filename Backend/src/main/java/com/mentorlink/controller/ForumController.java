package com.mentorlink.controller;

import com.mentorlink.dto.AddAnswerRequest;
import com.mentorlink.dto.CreateQuestionRequest;
import com.mentorlink.dto.UpdateQuestionRequest;
import com.mentorlink.entity.Question;
import com.mentorlink.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ForumController {
    
    private static final Logger logger = LoggerFactory.getLogger(ForumController.class);
    private final QuestionService questionService;
    
    /**
     * Get all questions with pagination
     */
    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "50") int limit,
        @RequestParam(defaultValue = "-createdAt") String sort) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions - Fetching all questions");
            Page<Question> questions = questionService.getAllQuestions(page, limit, sort);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Questions retrieved successfully");
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Get single question by ID
     */
    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable String id) {
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions/{} - Fetching question", id);
            Question question = questionService.getQuestionById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question retrieved successfully");
            response.put("question", question);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Create a new question (Authenticated)
     */
    @PostMapping("/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createQuestion(
        @Valid @RequestBody CreateQuestionRequest request,
        Authentication authentication) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] POST /api/forum/questions - Creating new question");
            String userId = authentication.getName();
            Question question = questionService.createQuestion(request, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question created successfully");
            response.put("question", question);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Update a question (Authenticated - Author only)
     */
    @PutMapping("/questions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateQuestion(
        @PathVariable String id,
        @Valid @RequestBody UpdateQuestionRequest request,
        Authentication authentication) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] PUT /api/forum/questions/{} - Updating question", id);
            String userId = authentication.getName();
            Question question = questionService.updateQuestion(id, request, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question updated successfully");
            response.put("question", question);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Delete a question (Authenticated - Author only)
     */
    @DeleteMapping("/questions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteQuestion(
        @PathVariable String id,
        Authentication authentication) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] DELETE /api/forum/questions/{} - Deleting question", id);
            String userId = authentication.getName();
            questionService.deleteQuestion(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Add an answer to a question (Authenticated)
     */
    @PostMapping("/questions/{id}/answer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addAnswer(
        @PathVariable String id,
        @Valid @RequestBody AddAnswerRequest request,
        Authentication authentication) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] POST /api/forum/questions/{}/answer - Adding answer", id);
            String userId = authentication.getName();
            Question question = questionService.addAnswer(id, request, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Answer added successfully");
            response.put("question", question);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Upvote a question (Authenticated)
     */
    @PostMapping("/questions/{id}/upvote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> upvoteQuestion(
        @PathVariable String id,
        Authentication authentication) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] POST /api/forum/questions/{}/upvote - Upvoting question", id);
            String userId = authentication.getName();
            Question question = questionService.upvoteQuestion(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Question upvoted successfully");
            response.put("upvotes", question.getUpvotes());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Get questions by category
     */
    @GetMapping("/questions/category/{category}")
    public ResponseEntity<?> getQuestionsByCategory(
        @PathVariable String category,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions/category/{} - Fetching questions by category", category);
            Page<Question> questions = questionService.getQuestionsByCategory(category, page, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Questions retrieved successfully");
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Get questions by mentor
     */
    @GetMapping("/mentor/{mentorId}/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuestionsByMentor(
        @PathVariable String mentorId,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/mentor/{}/questions - Fetching mentor's questions", mentorId);
            Page<Question> questions = questionService.getQuestionsByMentor(mentorId, page, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Questions retrieved successfully");
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    /**
     * Search questions
     */
    @GetMapping("/questions/search")
    public ResponseEntity<?> searchQuestions(
        @RequestParam String q,
        @RequestParam(required = false) String category,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit) {
        
        try {
            logger.info("🔵 [FORUM - JAVA] GET /api/forum/questions/search - Searching questions with query: {}", q);
            Page<Question> questions = questionService.searchQuestions(q, category, page, limit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Search results retrieved successfully");
            response.put("questions", questions.getContent());
            response.put("total", questions.getTotalElements());
            response.put("page", page);
            response.put("limit", limit);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
