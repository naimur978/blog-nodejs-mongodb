
# Blog-Post

## Description
Blog-Post is a Node.js application for creating and managing blog posts with user authentication, commenting, and email notifications.

## Features
- User Registration (email support)
- Login/Logout
- Forgot Password (email support)
- Reset Password (email support)
- View and Edit Profile
- Add Blog/Post
- View Blog/Post
- Edit Blog/Post
- Delete Blog/Post (with confirmation)
- Add Comment on a Blog/Post
- View Comment on a Blog/Post
- Account Locking (prevents brute-force attacks)

## Technology Stack
- Node.js (Server side JS)
- Express.js (Web Application Framework)
- Mongoose.js (ODM)
- MongoDB (Database)
- NodeMailer.js (Email)
- Passport.js (Authentication)
- Passport-local.js (Local Authentication)
- ReactJS (Frontend UI)

## Prerequisites
- [Node.js](https://www.guru99.com/download-install-node-js.html)
- [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)


## Installation
1. Clone the repository:
  ```sh
  git clone https://github.com/naimur978/blog-nodejs-mongodb.git
  ```
2. Go to the project root directory:
  ```sh
  cd blog-nodejs-mongodb
  ```
3. Install backend dependencies:
  ```sh
  npm install
  ```
4. Go to the frontend directory and install frontend dependencies:
  ```sh
  cd frontend
  npm install
  ```

5. Return to the root directory:
  ```sh
  cd ..
  ```
6. Start the development server:
  ```sh
  npm run dev
  ```

## Configuration
### Email Settings
The application sends emails for registration, password reset, and forgot password (Gmail only).
1. Edit `api/config/keys.js`.
2. Update `smtpConfig.auth` with your Gmail email and password.
3. Update the `from:` field in `regMailOptions`, `forgotMailOptions`, and `resetMailOptions`.
4. To disable email, set `disableEmailSending = "no"` in `api/config/keys.js`.
**Note:** You may need to allow less secure apps in your Gmail account. [See details](https://support.google.com/accounts/answer/6010255?hl=en).





## API Documentation

This section outlines all available API endpoints in the application, including detailed information about request bodies for POST requests.

### Table of Contents
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Blog Post Endpoints](#blog-post-endpoints)
- [View Endpoints](#view-endpoints)

---



## License
This project is licensed under the MIT License.

### Authentication Endpoints

#### Login
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

#### Register
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

#### Forgot Password
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

#### Reset Password
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

### User Management Endpoints

#### Profile Update
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

### Blog Post Endpoints

#### Create Post
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

#### Edit Post
- **URL**: `/post/:id/edit`
- **Method**: `POST`
- **Description**: Updates an existing blog post
- **Authentication**: Requires user to be logged in
- **Request Body**:
  ```json
  {
    "title": "Updated Blog Post Title",
    "description": "Updated description of the blog post",
    "body": "Updated content of the blog post...",
    "author": "john@example.com"
  }
  ```
- **Response**: Redirects to post detail page with success/error message

#### Delete Post
- **URL**: `/post/:id/delete`
- **Method**: `POST`
- **Description**: Deletes a blog post and its associated comments
- **Authentication**: Requires user to be logged in
- **Response**: Returns JSON
  ```json
  {
    "success": true,
    "message": "Post and related comments deleted successfully!"
  }
  ```
  or on error:
  ```json
  {
    "success": false,
    "message": "Error message here"
  }
  ```

#### Add Comment
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

### View Endpoints

#### Home Page
- **URL**: `/`
- **Method**: `GET`
- **Description**: Displays all blog posts
- **Authentication**: Requires user to be logged in

#### Login Page
- **URL**: `/login`
- **Method**: `GET`
- **Description**: Displays login form
- **Authentication**: Only accessible when logged out

#### Logout
- **URL**: `/logout`
- **Method**: `GET`
- **Description**: Logs out the current user and destroys session

#### Forgot Password Page
- **URL**: `/forgot`
- **Method**: `GET`
- **Description**: Displays forgot password form
- **Authentication**: Only accessible when logged out

#### Reset Password Page
- **URL**: `/reset/:token`
- **Method**: `GET`
- **Description**: Displays reset password form for a valid token
- **Authentication**: Only accessible with valid token

#### Register Page
- **URL**: `/register`
- **Method**: `GET`
- **Description**: Displays registration form
- **Authentication**: Only accessible when logged out

#### Profile Page
- **URL**: `/profile`
- **Method**: `GET`
- **Description**: Displays user profile information
- **Authentication**: Requires user to be logged in

#### Add Post Page
- **URL**: `/post`
- **Method**: `GET`
- **Description**: Displays form to create new blog post
- **Authentication**: Requires user to be logged in

#### Post Details Page
- **URL**: `/post/:id`
- **Method**: `GET`
- **Description**: Displays a specific blog post details
- **Authentication**: Requires user to be logged in

#### Edit Post Page
- **URL**: `/post/:id/edit`
- **Method**: `GET`
- **Description**: Displays form to edit an existing blog post
- **Authentication**: Requires user to be logged in

#### Post Comments Page
- **URL**: `/post/:id/comments`
- **Method**: `GET`
- **Description**: Displays comments for a specific blog post
- **Authentication**: Requires user to be logged in
