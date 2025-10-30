package com.__blog.model.dto.response;

public class TrendingTagDTO {

    private String tagName;
    private long postCount;

    public TrendingTagDTO(String tagName, long postCount) {
        this.tagName = tagName;
        this.postCount = postCount;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public void setPostCount(long postCount) {
        this.postCount = postCount;
    }

    public String getTagName() {
        return tagName;
    }

    public long getPostCount() {
        return postCount;
    }
}
