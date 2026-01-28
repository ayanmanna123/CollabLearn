package com.mentorlink.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Length;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    @Length(max = 200, message = "Title must be less than 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String category; // engineering, data-science, business, product, general
    
    @DBRef
    private User author;
    
    private List<Answer> answers = new ArrayList<>();
    
    private Integer upvotes = 0;
    
    private List<String> tags = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
