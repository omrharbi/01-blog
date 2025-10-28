package com.__blog.model.dto.response;

import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data 
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class NotificationResponse {
    private UUID id;
    private String type; // enum name, e.g. "NEW_POST"
    private String message;
    private boolean read;
    private String senderUsername;
    private String senderAvatar;
    private Date createdAt;
}