# AI Image Generator

A full-stack web application for generating AI images using Hugging Face and posting them to a community gallery.

## Features

- 🔐 User authentication with email verification
- 🎨 AI image generation using Hugging Face
- 📱 Responsive design with dark theme
- 🖼️ Image gallery with search functionality
- ☁️ Cloud storage with Cloudinary
- 📧 Email notifications

## Tech Stack

### Frontend
- React 18
- React Router
- Styled Components
- Material-UI Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Hugging Face API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Hugging Face account
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-project
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your actual credentials
   npm run dev  # For development
   npm start    # For production
   ```

3. **Client Setup**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with your production API URL
   npm start    # For development
   npm run build # For production
   ```

## Environment Variables

### Server (.env)
```env
PORT=8080
FRONTEND_URL=https://your-netlify-site.netlify.app
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HUGGINGFACE_TOKEN=your_huggingface_token
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client (.env)
```env
REACT_APP_API_URL=https://your-render-app.onrender.com/api/
```

## Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add all environment variables from .env.example
5. Deploy

### Frontend (Netlify)
1. Build command: `npm run build`
2. Publish directory: `build`
3. Add environment variable: `REACT_APP_API_URL=https://your-render-app.onrender.com/api/`
4. Deploy

## API Endpoints

- `GET /api/post/` - Get all posts
- `POST /api/post/` - Create new post
- `POST /api/generateImage/` - Generate AI image
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify email OTP

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.