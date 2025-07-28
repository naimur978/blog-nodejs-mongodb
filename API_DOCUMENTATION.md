# Blog-NodeJS-MongoDB API Documentation

This document outlines all available API endpoints in the Blog-NodeJS-MongoDB application, including detailed information about request bodies for POST requests.

## Table of Contents
- [Authentication Endpoints](#authentication-endpoints)
  - [Login](#login)
  - [Register](#register)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
- [User Management Endpoints](#user-management-endpoints)
  - [Profile Update](#profile-update)
- [Blog Post Endpoints](#blog-post-endpoints)
  - [Create Post](#create-post)
  - [Add Comment](#add-comment)
- [View Endpoints](#view-endpoints)

---

## Authentication Endpoints

### Login
- **URL**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user and creates a session
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "yourpassword"
  }
  ```
- **Response**: Redirects to home page on success, back to login page on failure

### Register
- **URL**: `/register`
- **Method**: `POST`
- **Description**: Creates a new user account
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**: Redirects to home page on success, back to register page on failure

### Forgot Password
- **URL**: `/forgot`
- **Method**: `POST`
- **Description**: Initiates password reset process by sending an email with reset token
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com"
  }
  ```
- **Response**: Redirects back to forgot password page with success/error message

### Reset Password
- **URL**: `/reset`
- **Method**: `POST`
- **Description**: Sets a new password using a reset token
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "password": "new_password"
  }
  ```
- **Response**: Redirects to login page on success

---

## User Management Endpoints

### Profile Update
- **URL**: `/profile`
- **Method**: `POST`
- **Description**: Updates user profile information
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "age": 30,
    "gender": "M",
    "address": "123 Main St, City",
    "website": "https://johndoe.com"
  }
  ```
- **Response**: Redirects to home page with success/error message

---

## Blog Post Endpoints

### Create Post
- **URL**: `/post`
- **Method**: `POST`
- **Description**: Creates a new blog post
- **Request Body**:
  ```json
  {
    "title": "My Blog Post Title",
    "description": "A short description of the blog post",
    "body": "Full content of the blog post...",
    "author": "John Doe"
  }
  ```
- **Note**: Author field is optional and defaults to "Anonymus" if not provided
- **Response**: Redirects to home page with success/error message

### Add Comment
- **URL**: `/post/comments`
- **Method**: `POST`
- **Description**: Adds a comment to a specific blog post
- **Request Body**:
  ```json
  {
    "postId": "60d21b4667d0d8992e610c85",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Great post! Thanks for sharing."
  }
  ```
- **Response**: Redirects to home page with success/error message

---

## View Endpoints

### Home Page
- **URL**: `/`
- **Method**: `GET`
- **Description**: Displays all blog posts
- **Authentication**: Requires user to be logged in

### Login Page
- **URL**: `/login`
- **Method**: `GET`
- **Description**: Displays login form
- **Authentication**: Only accessible when logged out

### Logout
- **URL**: `/logout`
- **Method**: `GET`
- **Description**: Logs out the current user and destroys session

### Forgot Password Page
- **URL**: `/forgot`
- **Method**: `GET`
- **Description**: Displays forgot password form
- **Authentication**: Only accessible when logged out

### Reset Password Page
- **URL**: `/reset/:token`
- **Method**: `GET`
- **Description**: Displays reset password form for a valid token
- **Authentication**: Only accessible with valid token

### Register Page
- **URL**: `/register`
- **Method**: `GET`
- **Description**: Displays registration form
- **Authentication**: Only accessible when logged out

### Profile Page
- **URL**: `/profile`
- **Method**: `GET`
- **Description**: Displays user profile information
- **Authentication**: Requires user to be logged in

### Add Post Page
- **URL**: `/post`
- **Method**: `GET`
- **Description**: Displays form to create new blog post
- **Authentication**: Requires user to be logged in

### Post Details Page
- **URL**: `/post/:id`
- **Method**: `GET`
- **Description**: Displays a specific blog post details
- **Authentication**: Requires user to be logged in

### Post Comments Page
- **URL**: `/post/:id/comments`
- **Method**: `GET`
- **Description**: Displays comments for a specific blog post
- **Authentication**: Requires user to be logged in
