package com.__blog.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.request.auth.UpdateProfileRequest;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository repouser;
    // @Autowired
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UploadFilesService uploadService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ResponseEntity<ApiResponse<User>> findUser(UUID id) {
        try {
            Optional<User> userOpt = repouser.findById(id);

            if (userOpt.isPresent()) {
                return ApiResponseUtil.success(userOpt.get(), null, "User found successfully");
            } else {
                return ApiResponseUtil.error(
                        "This user is not allowed or does not exist: " + id,
                        HttpStatus.NOT_FOUND
                );
            }
        } catch (Exception e) {
            return ApiResponseUtil.error(
                    "Failed to find user: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<ApiResponse<User>> register(User user) {
        if (repouser.existsByEmail(user.getEmail())) {
            return ApiResponseUtil.error("Email already exists", HttpStatus.CONFLICT);
        }

        // Check if username already exists
        if (repouser.existsByUsername(user.getUsername())) {
            return ApiResponseUtil.error("Username already exists", HttpStatus.CONFLICT);
        }

        // Save the user
        repouser.save(user);

        // Return success response
        return ApiResponseUtil.success(user, null, "Registration successful");
    }

    public ResponseEntity<ApiResponse<User>> findByUsername(String username) {
        try {
            Optional<User> userOpt = repouser.findByUsername(username);

            if (userOpt.isPresent()) {
                return ApiResponseUtil.success(userOpt.get(), null, "User found successfully");
            } else {
                return ApiResponseUtil.error(
                        "This user is not allowed or does not exist: " + username,
                        HttpStatus.NOT_FOUND
                );
            }
        } catch (Exception e) {
            return ApiResponseUtil.error(
                    "Failed to find user: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<ApiResponse<User>> findByEmail(String email) {
        try {
            Optional<User> userOpt = repouser.findByEmail(email);

            if (userOpt.isPresent()) {
                return ApiResponseUtil.success(userOpt.get(), null, "User found successfully");
            } else {
                return ApiResponseUtil.error(
                        "This user is not allowed or does not exist: " + email,
                        HttpStatus.NOT_FOUND
                );
            }
        } catch (Exception e) {
            return ApiResponseUtil.error(
                    "Failed to find user: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<ApiResponse<UserResponse>> profile(String username) {
        Optional<User> userOpt = repouser.findByUsername(username);
        if (userOpt.isPresent()) {
            UserResponse userResponse = userMapper.ConvertResponse(userOpt.get(), userOpt.get().getId());
            return ApiResponseUtil.success(userResponse, null, "User profile retrieved successfully");
        }
        return ApiResponseUtil.error("Sorry, this user was not found", HttpStatus.NOT_FOUND);
    }

    // @Transactional
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<User> users = repouser.findAll();
        List<UserResponse> allUserResponses = new ArrayList<>();
        for (var u : users) {

            UserResponse userResponses = userMapper.ConvertResponse(u, u.getId());
            allUserResponses.add(userResponses);
        }
        return ApiResponseUtil.success(allUserResponses, null, "All users retrieved successfully");
    }

    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(UserPrincipal userPrincipal, UpdateProfileRequest request,
            MultipartFile[] files) {
        Optional<User> user = repouser.findById(userPrincipal.getId());
        if (!user.isPresent()) {
            return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
        }
        User existingUser = user.get();
        if (request.getEmail() != null) {
            existingUser.setEmail(request.getEmail());
        }
        if (request.getUsername() != null) {
            existingUser.setUsername(request.getUsername());
        }

        if (request.getFirstname() != null) {
            existingUser.setFirstname(request.getFirstname());
        }

        if (request.getLastname() != null) {
            existingUser.setLastname(request.getLastname());
        }

        if (request.getAbout() != null) {
            // System.err.println("about"+);
            existingUser.setAbout(request.getAbout());
        }
        if (files != null) {
            try {

                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                ResponseEntity<ApiResponse<List<Map<String, String>>>> uploadFileResponse
                        = uploadService.uploadFile(files, uploadPath);

                ApiResponse<List<Map<String, String>>> uploadFileBody = uploadFileResponse.getBody();

                if (uploadFileBody != null && uploadFileBody.getData() != null && !uploadFileBody.getData().isEmpty()) {
                    String pathString = uploadFileBody.getData().get(0).get("filePath");
                    existingUser.setAvatar(pathString);
                } else {
                    return ApiResponseUtil.error("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
                }

            } catch (Exception e) {
                return ApiResponseUtil.error("Error uploading file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        if (request.getSkills() != null) {
            existingUser.setSkills(request.getSkills());
        }

        User userUpdate = repouser.save(existingUser);
        UserResponse response = userMapper.ConvertResponse(userUpdate, existingUser.getId());
        return ApiResponseUtil.success(response, null, "Profile updated successfully");
    }
    // public List
}
