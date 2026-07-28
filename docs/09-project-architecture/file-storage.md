# File Storage Architecture

> **Project:** SyncBoard
> **Document:** File Storage Architecture
> **Version:** 1.0

---

# 1. Overview

This document defines the file storage architecture for SyncBoard.

The application uses Cloudinary as its primary storage provider while keeping the storage layer abstract so that alternative providers (such as Amazon S3, Google Cloud Storage, or Azure Blob Storage) can be adopted in the future with minimal changes.

Primary goals:

- Secure uploads
- Optimized delivery
- Storage abstraction
- Scalability
- High availability
- Easy migration

---

# 2. Supported File Types

SyncBoard supports:

Images

- PNG
- JPG
- JPEG
- WEBP
- SVG

Documents

- PDF

Future Support

- PPTX
- DOCX
- XLSX
- ZIP

Unsupported file types should be rejected before upload.

---

# 3. Storage Providers

Current

```
Cloudinary
```

Future

```
Amazon S3

Google Cloud Storage

Azure Blob Storage
```

The application should interact with a storage service interface rather than a provider-specific implementation.

---

# 4. Architecture

```
Client

↓

File Upload API

↓

Validation

↓

Storage Service

↓

Cloudinary

↓

Database

↓

Client Response
```

The database stores metadata only, not binary file contents.

---

# 5. Upload Flow

```
User Selects File

↓

Client Validation

↓

Upload Request

↓

API Validation

↓

Cloudinary Upload

↓

Store Metadata

↓

Return File URL
```

Each upload must complete successfully before metadata is persisted.

---

# 6. Folder Organization

Cloudinary folders should be organized by resource type.

```
avatars/

workspace-assets/

board-thumbnails/

attachments/

exports/

temp/
```

This improves maintenance and lifecycle management.

---

# 7. Metadata

Each uploaded file should store:

- ID
- Original filename
- MIME type
- File size
- Storage provider
- Public ID
- URL
- Width (images)
- Height (images)
- Uploaded by
- Created at

---

# 8. Validation

Validate:

- File type
- File size
- MIME type
- Extension
- Ownership

Example limits:

Avatar

5 MB

Attachment

25 MB

Board Export

100 MB

---

# 9. Image Optimization

Cloudinary should automatically optimize:

- Compression
- Format conversion
- Responsive sizes
- Quality adjustments

Deliver modern formats (e.g., WebP or AVIF) where supported.

---

# 10. Access Control

Files may be:

Public

- Logos
- Public assets

Protected

- Workspace attachments
- Board files

Private

- Sensitive exports

Access permissions should be enforced before exposing protected resources.

---

# 11. File Lifecycle

```
Upload

↓

Validate

↓

Store

↓

Use

↓

Archive (optional)

↓

Delete
```

Unused temporary files should be cleaned up automatically.

---

# 12. Deletion Strategy

When deleting a file:

1. Verify permissions
2. Remove database metadata
3. Delete the file from Cloudinary
4. Log the operation

Deletion should be transactional where possible.

---

# 13. Error Handling

Handle:

- Invalid file type
- File too large
- Upload timeout
- Storage provider errors
- Missing metadata
- Permission denied

Users should receive clear, actionable error messages.

---

# 14. Security

Security measures include:

- MIME type validation
- File size limits
- Filename sanitization
- Virus scanning (future)
- Authorization checks
- Rate limiting

Never trust client-provided metadata.

---

# 15. Performance

Improve performance through:

- CDN delivery
- Image optimization
- Lazy loading
- Responsive images
- Caching
- Chunked uploads (future)

Avoid serving original high-resolution files unless necessary.

---

# 16. Storage Abstraction

The application should define a storage interface.

Example responsibilities:

- upload()
- delete()
- getUrl()
- getMetadata()

Business logic should depend on this interface rather than Cloudinary directly.

---

# 17. Monitoring

Track:

- Upload success rate
- Upload failures
- Average upload time
- Storage usage
- Bandwidth
- File count

Monitoring helps detect storage issues early.

---

# 18. Future Enhancements

Future improvements include:

- Signed upload URLs
- Drag-and-drop uploads
- Chunked uploads
- Versioned files
- File previews
- OCR for documents
- AI-powered image tagging

---

# 19. Best Practices

- Store metadata in PostgreSQL.
- Store binary files in Cloudinary.
- Validate every upload.
- Keep storage provider abstract.
- Organize files by feature.
- Delete orphaned files regularly.

---

# 20. Conclusion

The SyncBoard file storage architecture provides a secure, scalable, and provider-independent approach to file management. By separating metadata from binary storage and using a storage abstraction layer, the application remains maintainable and adaptable to future infrastructure changes.
