package com.__blog.service;

import java.awt.image.BufferedImage;
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

import javax.imageio.ImageIO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class UploadFilesService {
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> uploadFile(
            MultipartFile[] files, Path uploadPath) throws IOException {

        List<Map<String, String>> response = new ArrayList<>();

        if (files == null || files.length == 0) {
            return ApiResponseUtil.error("No files uploaded", HttpStatus.BAD_REQUEST);
        }

        // Allowed extensions
        Set<String> allowedExtensions = Set.of("jpeg", "jpg", "png", "gif", "webp", "mp4", "webm");

        // Allowed MIME types
        Set<String> allowedMime = Set.of(
                "image/jpeg", "image/png", "image/gif", "image/webp",
                "video/mp4", "video/webm");

        for (MultipartFile file : files) {

            String originalName = file.getOriginalFilename();
            if (originalName == null)
                originalName = "unnamed";

            String cleanName = StringUtils.cleanPath(originalName);

            // ---- Extension validation ----
            String ext = "";
            if (cleanName.contains(".")) {
                ext = cleanName.substring(cleanName.lastIndexOf(".") + 1).toLowerCase();
            }

            if (!allowedExtensions.contains(ext)) {
                return ApiResponseUtil.error(
                        "Invalid file type. Allowed: jpeg, jpg, png, gif, webp, mp4, webm",
                        HttpStatus.UNSUPPORTED_MEDIA_TYPE);
            }

            // ---- MIME validation ----
            String mime = file.getContentType();
            if (mime == null || !allowedMime.contains(mime)) {
                return ApiResponseUtil.error("Invalid or unknown file format", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
            }

            Map<String, String> metadata = new HashMap<>();
            metadata.put("filename", cleanName);
            metadata.put("extension", ext);
            metadata.put("mime", mime);
            metadata.put("filesize", String.valueOf(file.getSize()));

            // ---- IMAGE METADATA ----
            if (mime.startsWith("image/")) {
                BufferedImage img = ImageIO.read(file.getInputStream());
                if (img == null) {
                    return ApiResponseUtil.error("Corrupted image file", HttpStatus.BAD_REQUEST);
                }

                metadata.put("imageWidth", String.valueOf(img.getWidth()));
                metadata.put("imageHeight", String.valueOf(img.getHeight()));

                if (img.getWidth() < 50 || img.getHeight() < 50) {
                    return ApiResponseUtil.error("Image resolution too small (min 50×50)", HttpStatus.BAD_REQUEST);
                }
            }

            // ---- VIDEO BASIC CHECK ----
            if (mime.startsWith("video/")) {
                // No heavy ffmpeg parsing (simple validation)
                metadata.put("video", "true");

                // (Optional) check file size limit
                // if (file.getSize() > (50 * 1024 * 1024)) { // 50MB
                // return ApiResponseUtil.error("Video too large (max 50MB)",
                // HttpStatus.PAYLOAD_TOO_LARGE);
                // }
            }

            // ---- Save file ----
            String uniqueName = UUID.randomUUID() + "-" + cleanName;
            Path filePath = uploadPath.resolve(uniqueName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Response
            Map<String, String> fileResponse = new HashMap<>();
            fileResponse.put("filename", uniqueName);
            fileResponse.put("filePath", "uploads/" + uniqueName);
            fileResponse.putAll(metadata);

            response.add(fileResponse);
        }

        return ApiResponseUtil.success(response, null, "Upload Success");
    }

}
