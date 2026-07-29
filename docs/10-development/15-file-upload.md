# File Upload

> **Project:** SyncBoard
> **Document:** File Upload
> **Phase:** 10 - Development
> **Version:** 1.0

---

# 1. Overview

The File Upload Module manages all file-related operations in SyncBoard.

It enables users to upload, organize, retrieve, and delete files associated with boards, shapes, comments, and user profiles.

Supported features include:

- Image uploads
- Document uploads
- Drag & Drop
- File preview
- Secure storage
- File validation
- Access control
- File lifecycle management

Cloudinary serves as the primary storage provider.

---

# 2. Objectives

After implementing this module, users should be able to:

- Upload images
- Upload documents
- Drag and drop files
- Preview uploaded files
- Download files
- Replace files
- Delete files
- Attach files to comments
- Attach images to boards
- Manage profile pictures

---

# 3. Architecture

```
Client

↓

Upload Component

↓

Upload API

↓

File Service

↓

Cloudinary

↓

Database

↓

Application
```

---

# 4. Supported File Types

Images

```
PNG

JPG

JPEG

WEBP

SVG
```

Documents

```
PDF

DOCX

TXT

PPTX

XLSX
```

Future

```
ZIP

Audio

Video
```

---

# 5. File Lifecycle

```
Select File

↓

Validate

↓

Upload

↓

Cloudinary

↓

Save Metadata

↓

Display

↓

Delete
```

---

# 6. Database Model

Suggested fields:

```
id

uploadedBy

workspaceId

boardId

commentId

shapeId

fileName

originalName

mimeType

size

extension

cloudinaryPublicId

url

thumbnailUrl

createdAt

updatedAt

deletedAt
```

---

# 7. Upload Flow

```
Choose File

↓

Validate

↓

Generate Upload Request

↓

Cloudinary Upload

↓

Store Metadata

↓

Return Response
```

Only metadata is stored in PostgreSQL.

---

# 8. Validation Rules

Validate:

- File type
- File size
- MIME type
- Filename
- Upload permissions

Reject unsupported files immediately.

---

# 9. File Size Limits

Suggested limits:

Images

```
10 MB
```

Documents

```
25 MB
```

Future uploads (video) should have separate limits.

---

# 10. Drag & Drop

Support:

- Single file
- Multiple files
- Folder drop (future)

Display visual feedback during drag operations.

---

# 11. Image Optimization

Cloudinary should automatically provide:

- Compression
- Responsive sizes
- Format conversion
- Thumbnail generation

Avoid storing duplicate image variants manually.

---

# 12. File Preview

Supported previews:

- Images
- PDFs
- Text files

Unsupported formats should display an appropriate icon and download option.

---

# 13. Access Control

Users must have permission to access files.

Verify:

- Authentication
- Workspace membership
- Board access
- Comment visibility

Never expose direct storage credentials.

---

# 14. Service Layer

FileService responsibilities:

- Upload file
- Delete file
- Replace file
- Generate preview URL
- Validate uploads
- Retrieve metadata

Business rules belong here.

---

# 15. Repository Layer

FileRepository responsibilities:

- CRUD operations
- Metadata lookup
- Pagination
- Search
- Bulk deletion

No business logic should exist in repositories.

---

# 16. API Endpoints

```
POST   /api/files

GET    /api/files

GET    /api/files/:id

DELETE /api/files/:id

PATCH  /api/files/:id
```

Attachments

```
POST /api/comments/:id/files

POST /api/boards/:id/files
```

---

# 17. Storage Organization

Recommended Cloudinary folders:

```
avatars/

boards/

comments/

attachments/

exports/
```

This keeps uploaded assets organized and easier to manage.

---

# 18. Security

- Validate MIME types.
- Scan uploaded files (future enhancement).
- Restrict executable file uploads.
- Sanitize filenames.
- Verify ownership before deletion.
- Protect upload endpoints with authentication.

---

# 19. Performance

Optimize uploads by:

- Client-side compression (images)
- Chunked uploads (future)
- Lazy loading previews
- CDN delivery
- Caching metadata

---

# 20. Error Handling

Handle:

- Invalid file type
- Upload timeout
- Network interruption
- Cloudinary failure
- Permission denied
- File too large

Return consistent API error responses.

---

# 21. Testing

Verify:

- Image upload
- Document upload
- Drag & Drop
- File preview
- Download
- Replacement
- Deletion
- Authorization
- Validation
- Cloudinary integration

---

# 22. Best Practices

- Store only metadata in PostgreSQL.
- Keep original filenames for display.
- Use generated identifiers internally.
- Avoid duplicate uploads.
- Use Cloudinary transformations instead of storing multiple versions.

---

# 23. Verification Checklist

Before proceeding:

- Cloudinary configured
- File schema created
- Upload API implemented
- File service implemented
- Repository implemented
- Validation working
- Preview functionality verified
- Authorization enforced

---

# 24. Expected Outcome

At the end of this module:

- Users can upload and manage files securely.
- Images and documents integrate seamlessly with boards and comments.
- Cloudinary handles storage and optimization.
- The application is ready to implement advanced search capabilities across workspaces, boards, users, and uploaded content.
