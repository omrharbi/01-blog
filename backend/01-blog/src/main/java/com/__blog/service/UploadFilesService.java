package com.__blog.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class UploadFilesService {

    public ResponseEntity<ApiResponse<List<Map<String, String>>>> uploadFile(MultipartFile[] files, Path uploadPath)
            throws IOException {
        List<Map<String, String>> response = new ArrayList<>();
        if (files == null) {
            return null;
        }
        for (var file : files) {

            String originalFilename = file.getOriginalFilename();
            String fileExtensions = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtensions = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
            }
            Set<String> allowedImageExtensions = Set.of("jpeg", "jpg", "png", "gif", "webp", "mp4", "webm");
            if (!allowedImageExtensions.contains(fileExtensions)) {
                return ApiResponseUtil.error(
                        "Unsupported file type. Allowed file types: .jpeg, .jpg, .gif, .webp, .webm",
                        HttpStatus.UNSUPPORTED_MEDIA_TYPE);
            }
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
            fileResponse.put("filePath", "uploads/" + uniqueName);
            fileResponse.put("filetype", file.getContentType());
            fileResponse.put("filesize", String.valueOf(file.getSize()));

            response.add(fileResponse);
        }
        return ApiResponseUtil.success(response, null, "Upload Sucess ");

    }
}
