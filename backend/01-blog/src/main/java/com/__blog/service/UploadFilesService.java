package com.__blog.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.util.ApiResponse;
@Service
public class UploadFilesService {

    public ApiResponse<List<Map<String, String>>> uploadFile(MultipartFile[] files, Path uploadPath) throws IOException {
            List<Map<String, String>> response = new ArrayList<>();
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
                fileResponse.put("filePath", "uploads/" + uniqueName);
                fileResponse.put("filetype", file.getContentType());
                fileResponse.put("filesize", String.valueOf(file.getSize()));

                response.add(fileResponse);
            }

            return ApiResponse.<List<Map<String, String>>>builder().message("Upload Sucess ")
                    .data(response)
                    .build();
      
    }
}
