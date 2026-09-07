# YouTube Clone – MERN Stack

A full-stack YouTube Clone application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application allows users to register and log in, browse and search videos, filter videos by category, watch videos, interact with videos, comment, create and manage their own channel, and upload, edit, and delete videos.

---

## Project Features

### User Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes for authenticated users
* Logged-in username displayed in the header
* Logout functionality
* Form validation
* Authentication middleware on protected backend APIs

### Home Page

* YouTube-style header
* Toggleable sidebar
* Video thumbnail grid
* Video title
* Channel name
* View count
* Search videos by title
* Category filtering
* Loading and error states
* No-results message

### Search and Categories

Users can search videos by title.

Available categories:

* All
* Music
* Gaming
* Coding
* Education
* Entertainment
* Sports
* Technology

Videos uploaded by users are dynamically displayed on the homepage and can be filtered by category.

### Video Player

Users can:

* Open an individual video
* Watch the selected video
* View video title
* View description
* View channel information
* View video statistics
* Like videos
* Dislike videos
* Add comments
* Edit their own comments
* Delete their own comments

Comments are stored persistently in MongoDB.

### Channel Management

Authenticated users can:

* Create a channel
* View their channel
* Edit their channel name
* Edit their channel description
* Delete their channel
* View videos belonging to their channel

### Video Management

Channel owners can:

* Upload videos
* View uploaded videos
* Edit their own videos
* Delete their own videos
* Update title
* Update category
* Update description
* Update video URL
* Update thumbnail URL

Backend ownership authorization prevents users from modifying another user's content.

### Responsive Design

The application is responsive across:

* Desktop
* Tablet
* Mobile

The video grid automatically adjusts according to screen size and the interface is optimized for smaller screens.

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

---

## Project Structure

```text
youtube-clone/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── commentController.js
│   │   └── videoController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   ├── Video.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── videoRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── seed/
│   │   └── seed.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── Channel.jsx
│   │   │   └── UploadVideo.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Database Models

The application uses MongoDB with Mongoose.

### User

Stores:

* Username
* Email
* Hashed password

### Channel

Stores:

* Channel name
* Channel description
* Channel owner

### Video

Stores:

* Title
* Category
* Description
* Video URL
* Thumbnail URL
* Channel
* Uploader
* Views
* Likes
* Dislikes
* Upload date

### Comment

Stores:

* Comment text
* Video reference
* User reference
* Created/updated timestamps

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description               | Authentication |
| ------ | -------------------- | ------------------------- | -------------- |
| POST   | `/api/auth/register` | Register a user           | No             |
| POST   | `/api/auth/login`    | Login user                | No             |
| GET    | `/api/auth/profile`  | Get authenticated profile | Yes            |
| GET    | `/api/auth/me`       | Get current user          | Yes            |

### Channels

| Method | Endpoint                   | Description                  | Authentication |
| ------ | -------------------------- | ---------------------------- | -------------- |
| POST   | `/api/channels`            | Create channel               | Yes            |
| GET    | `/api/channels/my-channel` | Get logged-in user's channel | Yes            |
| GET    | `/api/channels/:id`        | Get channel                  | No             |
| PUT    | `/api/channels/:id`        | Update own channel           | Yes            |
| DELETE | `/api/channels/:id`        | Delete own channel           | Yes            |

### Videos

| Method | Endpoint                         | Description           | Authentication |
| ------ | -------------------------------- | --------------------- | -------------- |
| POST   | `/api/videos`                    | Upload/create video   | Yes            |
| GET    | `/api/videos`                    | Get all videos        | No             |
| GET    | `/api/videos/:id`                | Get individual video  | No             |
| GET    | `/api/videos/channel/:channelId` | Get channel videos    | No             |
| PUT    | `/api/videos/:id`                | Update own video      | Yes            |
| DELETE | `/api/videos/:id`                | Delete own video      | Yes            |
| PUT    | `/api/videos/:id/views`          | Increment video views | No             |
| PUT    | `/api/videos/:id/like`           | Like video            | Yes            |
| PUT    | `/api/videos/:id/dislike`        | Dislike video         | Yes            |

### Comments

| Method | Endpoint                       | Description        | Authentication |
| ------ | ------------------------------ | ------------------ | -------------- |
| GET    | `/api/comments/video/:videoId` | Get video comments | No             |
| POST   | `/api/comments/video/:videoId` | Add comment        | Yes            |
| PUT    | `/api/comments/:id`            | Update own comment | Yes            |
| DELETE | `/api/comments/:id`            | Delete own comment | Yes            |

---

## Authentication Flow

1. User registers using username, email, and password.
2. Password is securely hashed using bcrypt.
3. User logs in using email and password.
4. Backend verifies the credentials.
5. Backend generates a JWT token.
6. Frontend stores the token in `localStorage`.
7. Protected API requests send the token using the Authorization header.
8. Backend middleware verifies the JWT before allowing protected operations.

Example authorization header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## MongoDB Setup

This project uses a local MongoDB database.

Database name:

```text
youtube_clone
```

Example MongoDB connection:

```text
mongodb://127.0.0.1:27017/youtube_clone
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/youtube_clone
JWT_SECRET=your_super_secret_youtube_clone_key_2026
```

Do not commit the `.env` file to GitHub.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/deepakgoyal106/youtube-clone
cd youtube-clone
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create:

```text
backend/.env
```

Add:

```env
MONGO_URI=mongodb://127.0.0.1:27017/youtube_clone
JWT_SECRET=your_super_secret_youtube_clone_key_2026
```

### 4. Start MongoDB

Make sure your local MongoDB server is running.

### 5. Start the backend

From the `backend` folder:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5050
```

### 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

## Seed Demo Data

The project includes a safe MongoDB seed script for demonstration purposes.

From the backend folder:

```bash
npm run seed
```

The seed creates demo data only when the corresponding records do not already exist.

Demo account:

```text
Email: demo@youtubeclone.com
Password: Demo@12345
Username: DemoUser
```

The seed includes:

* Demo user
* Demo channel
* Demo videos
* Demo comment

---

## Application Routes

### Frontend Routes

| Route        | Description  |
| ------------ | ------------ |
| `/`          | Home page    |
| `/video/:id` | Video player |
| `/channel`   | My Channel   |
| `/upload`    | Upload video |
| `/register`  | Registration |
| `/login`     | Login        |

Protected pages:

* `/channel`
* `/upload`

These pages require authentication.

---

## Security and Authorization

The backend uses JWT authentication and authorization middleware.

Users can only:

* Edit their own channel
* Delete their own channel
* Edit their own videos
* Delete their own videos
* Edit their own comments
* Delete their own comments

Passwords are never stored as plain text. Passwords are hashed using bcrypt before being saved to MongoDB.

Sensitive configuration values are stored in `.env` and excluded from Git using `.gitignore`.

---

## Error Handling

The application handles common errors including:

* Invalid registration data
* Duplicate email registration
* Invalid login credentials
* Missing authentication token
* Invalid or expired JWT
* Unauthorized content modification
* Missing channel
* Missing video
* Missing comment
* Failed API requests
* Empty search results

---

## Responsive Design

The interface supports multiple screen sizes.

### Desktop

* Multi-column video grid
* Sidebar navigation
* Full-width header

### Tablet

* Reduced video grid columns
* Flexible content layout

### Mobile

* Single-column video grid
* Responsive header
* Responsive channel controls
* Full-width action buttons
* Mobile-friendly forms

---

## Main User Flow

```text
Register
   ↓
Login
   ↓
Home Page
   ↓
Search / Filter Videos
   ↓
Open Video
   ↓
Watch / Like / Dislike / Comment
   ↓
My Channel
   ↓
Create / Edit Channel
   ↓
Upload Video
   ↓
Edit / Delete Own Videos
```

---

## Future Improvements

Possible future enhancements include:

* Video upload to cloud storage
* Real-time notifications
* Subscription system
* Watch history
* Playlists
* Nested comments
* User profile images
* Advanced video recommendations
* Persistent like/dislike tracking per user
* Pagination and infinite scrolling

---

## Educational Purpose

This project was developed as part of an Internshala MERN Stack capstone project to demonstrate practical implementation of:

* React.js
* React Router
* Axios
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* REST APIs
* CRUD operations
* Protected routes
* Responsive web design

---

## Author

Developed as a MERN Stack YouTube Clone project.

---

## License

This project is intended for educational and demonstration purposes.

## Github
https://github.com/deepakgoyal106/youtube-clone