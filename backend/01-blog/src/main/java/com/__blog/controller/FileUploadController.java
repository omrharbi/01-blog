package com.__blog.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam MultipartFile[] files) throws IOException {
        // create directory if it doesn’t exist
        System.err.println("files" + Arrays.toString(files));
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        List<Map<String, String>> response  = new ArrayList<>();
        for (var file : files) {

            String originalName = file.getOriginalFilename();
            if (originalName == null) {
                originalName = "unnamed";
            }
            originalName = StringUtils.cleanPath(originalName);
            String uniqueName = UUID.randomUUID() + "-" + originalName;

            Path filePath = uploadPath.resolve(uniqueName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Map<String, String> fileResponse = new HashMap<>();
            fileResponse.put("filename", uniqueName);
            fileResponse.put("filePath", "http://localhost:9090/uploads/" + uniqueName);
            fileResponse.put("filetype", file.getContentType());
            fileResponse.put("filesize", String.valueOf(file.getSize()));

            response.add(fileResponse);
        }

        return ResponseEntity.ok(response);
    }

}
