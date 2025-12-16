# TODO: Fix Post Creation, Update, and Display Issues

## Issues Identified:
- Video tags sometimes use incorrect file paths (e.g., PNG sources for videos) due to unordered media arrays.
- fileType set based on filename extension instead of MIME type from upload response.
- Media arrays not sorted by displayOrder, causing wrong filePath assignment.

## Fixes Needed:
- [ ] Update PostRepository queries to order medias by displayOrder ASC.
- [ ] Sort medias in PostService after fetching posts.
- [x] Sort postData.medias in create-post.ts for edit mode.
- [x] Use MIME type from upload response for fileType in submitPost instead of extension.
- [x] Test the fixes to ensure videos display correctly.
