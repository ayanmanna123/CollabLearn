package com.mentorlink.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddAnswerRequest {
    
    @NotBlank(message = "Answer content is required")
    private String content;
}
