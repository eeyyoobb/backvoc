import express from 'express';
import Quiz from '../models/QuizSchema.js';

const router = express.Router();

// POST /api/quizzes - Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { quizTitle, icon, quizQuestions } = req.body;
    const newQuiz = new Quiz({ quizTitle, icon, quizQuestions });

    const savedQuiz = await newQuiz.save();
    res.status(201).json({
      id: savedQuiz._id,
      message: 'The quiz has been created successfully',
      quiz: savedQuiz,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/quizzes - Retrieve all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/quizzes/:id - Update an existing quiz
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, quizTitle, quizQuestions } = req.body; // Destructure icon, quizTitle, and quizQuestions from the request body
    const quizToUpdate = await Quiz.findById(id);
    if (!quizToUpdate) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update quiz properties if provided in the request body
    if (icon) quizToUpdate.icon = icon;
    if (quizTitle) quizToUpdate.quizTitle = quizTitle;
    if (quizQuestions) quizToUpdate.quizQuestions = quizQuestions;

    // Save the updated quiz
    const updatedQuiz = await quizToUpdate.save();
    res.json({ message: 'Success', quiz: updatedQuiz });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/quizzes/:id - Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
