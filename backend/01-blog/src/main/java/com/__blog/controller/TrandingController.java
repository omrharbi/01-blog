package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.service.TagsService;

@RestController
@RequestMapping("/api")
public class TrandingController {

    @Autowired
    private TagsService service;

    @GetMapping("/trainding")
    public ResponseEntity<?> tranding() {
        var result = service.findTrendingTags();
        return ResponseEntity.ok(result);
    }
}
