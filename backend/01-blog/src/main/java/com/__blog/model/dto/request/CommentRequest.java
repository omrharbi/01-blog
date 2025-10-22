package com.__blog.model.dto.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentRequest {

     private String content;
     private UUID postId;
     private UUID parentCommentId;

}
