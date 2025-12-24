# NetV!be 🌐

A modern full-stack social media application built with the MERN stack.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)
![Material UI](https://img.shields.io/badge/Material_UI-7.3.4-007FFF?style=flat&logo=mui)

## 🚀 Live Demo

**[View Live App →](https://netvibe1.vercel.app)**

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 📝 **Create Posts** - Share text and images with your network
- ❤️ **Like & Comment** - Engage with posts from other users
- 👥 **Friend System** - Add and remove friends
- 👤 **Profile Management** - Edit your profile information
- 🌓 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Redux Toolkit** - State management
- **Material UI** - Component library
- **React Router** - Navigation
- **Formik & Yup** - Form handling and validation
- **React Dropzone** - File uploads

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### Deployment
- **Frontend** - Vercel
- **Backend** - Render
- **Database** - MongoDB Atlas

## 📸 Screenshots

| Login Page | Home Feed |
|------------|-----------|
| Login with email and password | View and create posts |

| Profile Page | Dark Mode |
|--------------|-----------|
| View user profiles | Toggle dark/light theme |

## 🏃‍♂️ Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryan2022-bit/NetVibe.git
   cd NetVibe
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the `server` folder:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the application**
   
   Start the backend (from `/server`):
   ```bash
   npm start
   ```
   
   Start the frontend (from `/client`):
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
NetVibe/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── scenes/         # Page components
│       │   ├── homePage/
│       │   ├── loginPage/
│       │   ├── navbar/
│       │   ├── profilePage/
│       │   └── widgets/
│       ├── state/          # Redux store
│       └── theme.js        # MUI theme config
│
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── public/assets/      # Uploaded files
│
└── README.md
```

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user by ID |
| GET | `/users/:id/friends` | Get user's friends |
| PATCH | `/users/:id/:friendId` | Add/remove friend |
| PATCH | `/users/:id` | Update user profile |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts/:userId/posts` | Get user's posts |
| POST | `/posts` | Create new post |
| PATCH | `/posts/:id/like` | Like/unlike post |
| POST | `/posts/:id/comment` | Add comment |
| DELETE | `/posts/:id` | Delete post |

## 👨‍💻 Author

**Aryan Prasad**

- GitHub: [@aryan2022-bit](https://github.com/aryan2022-bit)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this project helpful, please give it a star!**
