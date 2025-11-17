import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Layout } from '../../components/common';
import type { CreateExamDto, CreateQuestionDto } from '../../shared/dtos';

export const AdminCreateExamPage = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState<Partial<CreateExamDto>>({
    title: '',
    description: '',
    type: 'standard',
    access_code: '',
    duration_minutes: 60,
    start_at: '',
    end_at: '',
  });

  const [questions, setQuestions] = useState<Partial<CreateQuestionDto>[]>([
    {
      question_text: '',
      question_type: 'single_choice',
      points: 1,
      choices: [
        { choice_text: '', is_correct: false },
        { choice_text: '', is_correct: false },
      ],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        question_type: 'single_choice',
        points: 1,
        choices: [
          { choice_text: '', is_correct: false },
          { choice_text: '', is_correct: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleAddChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices = [];
    }
    newQuestions[questionIndex].choices!.push({ choice_text: '', is_correct: false });
    setQuestions(newQuestions);
  };

  const handleRemoveChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices = newQuestions[questionIndex].choices!.filter(
      (_, i) => i !== choiceIndex
    );
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    field: string,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices![choiceIndex] = {
      ...newQuestions[questionIndex].choices![choiceIndex],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    const examData = {
      ...exam,
      questions,
    };
    console.log('Creating exam:', examData);
    // In a real app, submit to backend
    navigate('/admin/exams');
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Create New Exam
        </Typography>

        {/* Exam Details */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Exam Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Exam Title"
              value={exam.title}
              onChange={(e) => setExam({ ...exam, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={exam.description}
              onChange={(e) => setExam({ ...exam, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Exam Type</InputLabel>
                <Select
                  value={exam.type}
                  label="Exam Type"
                  onChange={(e) => setExam({ ...exam, type: e.target.value as any })}
                >
                  <MenuItem value="multiple_choice">Standard (Multiple Choice)</MenuItem>
                  <MenuItem value="essay">Essay</MenuItem>
                  <MenuItem value="coding">Coding</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Access Code"
                value={exam.access_code}
                onChange={(e) => setExam({ ...exam, access_code: e.target.value })}
                required
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={exam.duration_minutes}
                onChange={(e) =>
                  setExam({ ...exam, duration_minutes: parseInt(e.target.value) })
                }
              />
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={exam.start_at}
                onChange={(e) => setExam({ ...exam, start_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={exam.end_at}
                onChange={(e) => setExam({ ...exam, end_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Questions */}
        {exam.type !== 'coding' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Questions</Typography>
              <Button variant="outlined" startIcon={<Add />} onClick={handleAddQuestion}>
                Add Question
              </Button>
            </Box>

            {questions.map((question, qIndex) => (
              <Paper key={qIndex} elevation={2} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Question {qIndex + 1}
                  </Typography>
                  {questions.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveQuestion(qIndex)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Question Text"
                    multiline
                    rows={2}
                    value={question.question_text}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, 'question_text', e.target.value)
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Question Type</InputLabel>
                      <Select
                        value={question.question_type}
                        label="Question Type"
                        onChange={(e) =>
                          handleQuestionChange(qIndex, 'question_type', e.target.value)
                        }
                      >
                        <MenuItem value="single_choice">Single Choice</MenuItem>
                        <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                        <MenuItem value="short_answer">Short Answer</MenuItem>
                        <MenuItem value="essay">Essay</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label="Points"
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'points', parseFloat(e.target.value))
                      }
                      sx={{ width: 150 }}
                    />
                  </Box>

                  {(question.question_type === 'single_choice' ||
                    question.question_type === 'multiple_choice') && (
                    <>
                      <Divider />
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2">Choices</Typography>
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => handleAddChoice(qIndex)}
                          >
                            Add Choice
                          </Button>
                        </Box>
                        {question.choices?.map((choice, cIndex) => (
                          <Box key={cIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label={`Choice ${cIndex + 1}`}
                              value={choice.choice_text}
                              onChange={(e) =>
                                handleChoiceChange(qIndex, cIndex, 'choice_text', e.target.value)
                              }
                            />
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel>Correct?</InputLabel>
                              <Select
                                value={choice.is_correct ? 'yes' : 'no'}
                                label="Correct?"
                                onChange={(e) =>
                                  handleChoiceChange(
                                    qIndex,
                                    cIndex,
                                    'is_correct',
                                    e.target.value === 'yes'
                                  )
                                }
                              >
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                              </Select>
                            </FormControl>
                            {question.choices!.length > 2 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveChoice(qIndex, cIndex)}
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}

                  {question.question_type === 'short_answer' && (
                    <TextField
                      fullWidth
                      label="Correct Answer"
                      placeholder="Enter the expected answer"
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'correct_answer', [e.target.value])
                      }
                    />
                  )}
                </Box>
              </Paper>
            ))}
          </>
        )}

        {exam.type === 'coding' && (
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Coding Problem
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You can add coding problem details and test cases after creating the exam.
            </Typography>
          </Paper>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/admin/exams')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create Exam
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
