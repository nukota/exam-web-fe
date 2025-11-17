import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import { Timer, Send, PlayArrow } from '@mui/icons-material';
import { Layout } from '../../components/common';
import { CodeEditor } from '../../components/student/CodeEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const StudentCodingExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('# Write your Python code here\n\ndef solution():\n    pass\n');
  const [language, setLanguage] = useState('python');
  const [timeRemaining, setTimeRemaining] = useState(5400); // 90 minutes
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    console.log('Submitting code:', code);
    console.log('Language:', language);
    navigate(`/student/exam/${examId}/result`);
  };

  const handleRunCode = () => {
    // Placeholder for code execution
    alert('Code execution feature will be implemented in the future');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Python Programming Challenge
            </Typography>
            <Chip
              icon={<Timer />}
              label={formatTime(timeRemaining)}
              color={timeRemaining < 300 ? 'error' : 'primary'}
            />
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Problem Description */}
          <Paper elevation={2} sx={{ flex: 1, p: 3 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Problem" />
              <Tab label="Test Cases" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Problem Statement
              </Typography>
              <Typography variant="body1" paragraph>
                Write a function that finds the longest palindromic substring in a given string.
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Example:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100', fontFamily: 'monospace' }}>
                <Typography variant="body2">Input: "babad"</Typography>
                <Typography variant="body2">Output: "bab" or "aba"</Typography>
              </Paper>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Constraints:
              </Typography>
              <Typography variant="body2" component="ul">
                <li>1 ≤ string length ≤ 1000</li>
                <li>String consists of lowercase letters only</li>
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Chip label="10 points" color="primary" />
                <Chip label="Medium" color="warning" sx={{ ml: 1 }} />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Test Cases
              </Typography>

              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Test Case 1:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  Input: "babad"<br />
                  Expected Output: "bab" or "aba"
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Test Case 2:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  Input: "cbbd"<br />
                  Expected Output: "bb"
                </Typography>
              </Paper>

              <Typography variant="caption" color="text.secondary">
                Note: Some test cases may be hidden and will only be revealed after submission.
              </Typography>
            </TabPanel>
          </Paper>

          {/* Code Editor */}
          <Box sx={{ flex: 1 }}>
            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || '')}
              language={language}
              onLanguageChange={setLanguage}
              height="calc(100vh - 250px)"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={handleRunCode}
              >
                Run Code
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Send />}
                onClick={() => setSubmitDialogOpen(true)}
                sx={{ ml: 'auto' }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Submit Confirmation Dialog */}
        <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
          <DialogTitle>Submit Code?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to submit your code? Once submitted, you cannot make changes.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="success">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};
