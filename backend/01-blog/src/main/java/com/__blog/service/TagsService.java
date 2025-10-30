package com.__blog.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.__blog.model.dto.response.TrendingTagDTO;
import com.__blog.repository.TagRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TagsService {

    private final TagRepository tagRepository;

    public List<TrendingTagDTO> findTrendingTags() {
        List<Object[]> results = tagRepository.findTrendingTags();
        return results.stream()
                .map(r -> new TrendingTagDTO((String) r[0], (Long) r[1]))
                .collect(Collectors.toList());
    }
}
