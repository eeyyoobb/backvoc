import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
  id: { type: String, required: true },
  mainQuestion: { type: String, required: true },
  choices: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  answeredResult: { type: Number, default: -1 },
  explanation:{type:String, required: true },
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    incorrectAttempts: { type: Number, default: 0 },
  },
}, { _id: false });

const quizSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  quizTitle: { type: String, required: true },
  quizQuestions: { type: [questionSchema], required: true },
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

export default Quiz;
