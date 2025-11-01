package com.__blog.model.enums;

public enum ReportReason {
    SPAM, // suspand or warn
    HARASSMENT,
    HATE_SPEECH,
    VIOLENCE,
    MISINFORMATION,
    OTHER;

    public boolean shouldDeletePost() {
        return switch (this) {
            case HARASSMENT, HATE_SPEECH, VIOLENCE -> true;
            default -> false;
        };
    }

    public boolean shouldHidePost() {
        return !shouldDeletePost();
    }

    public boolean shouldDeleteComment() {
        return switch (this) {
            case HARASSMENT, HATE_SPEECH, VIOLENCE -> true;
            default -> false;
        };
    }

    public boolean shouldHideComment() {
        return !shouldDeleteComment();
    }

    public boolean shouldDeleteUser() {
        return switch (this) {
            case HARASSMENT, HATE_SPEECH, VIOLENCE -> true;
            default -> false;
        };
    }

    public boolean shouldHideUser() {
        return switch (this) {
            case SPAM, MISINFORMATION, OTHER -> true;
            default -> false;
        };
    }
}
