package com.__blog.model.dto.request;

import java.util.UUID;
import lombok.Data;
@Data
public class CommentRequest {

     private String content;
     private UUID postId;
     private UUID parentCommentId;

}
