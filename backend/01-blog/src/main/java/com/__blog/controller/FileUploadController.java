package com.__blog.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.service.UploadFilesService;
import com.__blog.util.ApiResponse;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class FileUploadController {

    @Autowired
    private UploadFilesService uploadService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam MultipartFile[] files) throws IOException {
        // create directory if it doesn’t exist
        // System.err.println("files" + Arrays.toString(files));
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            ApiResponse<List<Map<String, String>>> uploadFile = uploadService.uploadFile(files, uploadPath);
            return ResponseEntity.ok(uploadFile.getData());
        } catch (IOException e) {
            return ResponseEntity.ok("Erroro "+e);
        }

    }

}
