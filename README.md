# Blog-Post

This is my 1st Node.js application. It has following functionalities `(find sceenshot by clicking each link)`.
1. [User Registration](public/images/screenshots/register.JPG) (email support)
2. [Login/Logout](public/images/screenshots/login.JPG)
3. [Forgot Password](public/images/screenshots/forgot.JPG) (email support) 
4. [Reset Password](public/images/screenshots/reset.JPG) (email support)
5. [View and Edit Profile](public/images/screenshots/profile.JPG)
6. [Add Blog/Post](public/images/screenshots/add_post.JPG)
7. [View Blog/Post](public/images/screenshots/dashboard.JPG)
8. [Add Comment on a Blog/Post](public/images/screenshots/post_details.JPG)
9. [View Comment on a Blog/Post](public/images/screenshots/comment.JPG)
10. Account Locking (to prevent brute-force attacks by enforcing a maximum number of failed login attempts)

## Technology
1. Node.js (Server side JS)
2. Express.js (Web Application Framework)
3. Mongoose.js (ODM - Object Document Mapper)
4. MongoDB (Document Database)
5. NodeMailer.js (Email)
6. Passport.js (Authentication and Session Management)
7. Passport-local.js (Local Authentication)
8. Handlebars.js (Template Engine)
9. Bootstrap.js (Frontend, UI)
10. Bootstrap-validator.js (HTML Form validation)

## Prerequisites
1. Insatll Node.js [See this](https://www.guru99.com/download-install-node-js.html) for installation steps.
2. Install MongoDB [See this](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) for installation steps.

## Installation
1. Download the project as zip or do a git clone from [here](https://github.com/naimur978/blog-nodejs-mongodb.git)
2. Go to the root dir (Blog-Post).
3. Use the standard node app installation process to use the application (`npm install`).
    - This should install all the dependent node-modules from `package.json`.
    
## Email Setting
The application sends mail for `Successful Registration`, `Forgot Password` and `Successful Reset Password` from `gmail only account`.
1. Edit `config\keys.js`.
2. Change `smtpConfig=>auth` with your gmail account email id and password.
3. Change `from:` with your gmail account email id in `regMailOptions,forgotMailOptions,resetMailOptions`.
4. To disbale email, edit config/keys.js and set `disableEmailSending = "no"`.
**Note** You have to edit your gmail acoount's setting in order to send mail from less secure application. [See this](https://support.google.com/accounts/answer/6010255?hl=en) for more details.


## Start
1. Usual Mode start (code changes do not reflect on the fly) `node app.js`
2. Development Mode Start (code changes reflect on the fly) `SET DEBUG=Blog-Post:* & npm run devstart`
3. Open the application in any browser with http://localhost:8080/

## API Documentation

This section outlines all available API endpoints in the application, including detailed information about request bodies for POST requests.

### Table of Contents
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

#### Post Comments Page
- **URL**: `/post/:id/comments`
- **Method**: `GET`
- **Description**: Displays comments for a specific blog post
- **Authentication**: Requires user to be logged in
