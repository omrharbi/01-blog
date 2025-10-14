package com.__blog.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.entity.Media;
import com.__blog.repository.MediaRepository;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private static final Logger logger = LoggerFactory.getLogger(MediaController.class);

    private final MediaRepository mediaRepository;

    @Autowired
    public MediaController(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Media>> getMediasByPostId(@PathVariable Integer postId) {
        logger.debug("Received request to get medias for postId: {}", postId);

        List<Media> medias = mediaRepository.findByPost_Id(postId);

        if (medias == null) {
            logger.warn("MediaRepository returned null for postId: {}", postId);
            return ResponseEntity.notFound().build();
        }

        logger.debug("Found {} media items for postId: {}", medias.size(), postId);

        return ResponseEntity.ok(medias);
    }
 
}
