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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.request.auth.UpdateProfileRequest;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

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

    public ApiResponse<User> finduser(UUID id) {
        var user = repouser.findById(id);
        if (user.isPresent()) {
            return ApiResponse.<User>builder()
                    .status(true).data(user.get()).build();
        } else {

            return ApiResponse.<User>builder().status(false).error("This user is not allowed or does not exist: " + id)
                    .build();
        }
    }

    public String register(User user) {
        if (repouser.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repouser.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        repouser.save(user);
        return "register succss";
    }

    public ApiResponse<User> findByUsername(String username) {
        var user = repouser.findByUsername(username);
        if (user.isPresent()) {
            return ApiResponse.<User>builder().status(true).data(user.get()).build();
        } else {
            return ApiResponse.<User>builder().status(false)
                    .error("This user is not allowed or does not exist: " + username).build();

        }

    }

    public ApiResponse<User> findByEmail(String username) {
        var user = repouser.findByEmail(username);
        if (user.isPresent()) {
            return ApiResponse.<User>builder().status(true).data(user.get()).build();
        } else {
            return ApiResponse.<User>builder().status(false)
                    .error("This user is not allowed or does not exist: " + username).build();

        }
    }

    public ApiResponse<UserResponse> profile(String username) {
        Optional<User> user = repouser.findByUsername(username);
        if (user.isPresent()) {

            UserResponse userResponse = userMapper.ConvertResponse(user.get(), user.get().getId());
            return ApiResponse.<UserResponse>builder().status(true)
                    .data(userResponse).build();
        }
        return ApiResponse.<UserResponse>builder()
                .status(false)
                .error("Sory this user Not Found")
                .build();
    }

    // @Transactional
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<User> users = repouser.findAll();
        List<UserResponse> allUser = new ArrayList<>();
        for (var u : users) {

            UserResponse userResponses = userMapper.ConvertResponse(u, u.getId());
            allUser.add(userResponses);
        }
        return ApiResponse.<List<UserResponse>>builder()
                .status(true)
                .data(allUser)
                .build();
    }

    public ApiResponse<UserResponse> updateProfile(UserPrincipal userPrincipal, UpdateProfileRequest request,
            MultipartFile[] files) {
        Optional<User> user = repouser.findById(userPrincipal.getId());
        if (!user.isPresent()) {
            return ApiResponse.<UserResponse>builder()
                    .status(false)
                    .error("User not found")
                    .build();
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
                ApiResponse<List<Map<String, String>>> uploadFile = uploadService.uploadFile(files, uploadPath);
                String pathString = uploadFile.getData().get(0).get("filePath");
                existingUser.setAvatar(pathString);

            } catch (Exception e) {
                return ApiResponse.<UserResponse>builder()
                        .status(true)
                        // .data(response)
                        .error("Error To Upload")
                        .build();
            }
        }
        if (request.getSkills() != null) {
            existingUser.setSkills(request.getSkills());
        }

        User userUpdate = repouser.save(existingUser);
        UserResponse response = userMapper.ConvertResponse(userUpdate, existingUser.getId());
        return ApiResponse.<UserResponse>builder()
                .status(true)
                .data(response)
                .build();
    }
    // public List
}
