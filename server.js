import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";
import quizRoutes from "./routes/quizroute.js";
import quizzesRoutes from "./routes/Quizzesroute.js";
import bodyParser from "body-parser"
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";
import videoRoutes from "./routes/videoRoutes.js";
import bookRoutes from "./routes/book-routes.js";
import authRoutes from "./routes/auth.js";
import commentvideo from "./routes/commenvideo.js";
import cookieParser from 'cookie-parser';

config();
const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/commentube', commentvideo);
app.use('/api/post-categories', postCategoriesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/books", bookRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Static assets
app.use('/uploads', express.static(path.join(process.cwd(), '/uploads')));

// Error handling middleware
app.use(invalidPathHandler);
app.use(errorResponserHandler);

// Default route
app.get('/', (req, res) => {
  try {
    res.json('Get Request');
  } catch (error) {
    res.json(error);
  }
});

// Start the server
const port = process.env.PORT || 'https://voc-api.onrender.com';
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server connected to http://localhost:${port}`);
  });
}).catch(error => {
  console.log('Invalid Database Connection');
});
