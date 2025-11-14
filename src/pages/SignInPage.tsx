import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../shared/providers/AuthProvider';

export const SignInPage = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // Redirect based on user role
      if (currentUser.role === 'admin' || currentUser.role === 'teacher') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/exams');
      }
    }
  }, [currentUser, navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
            ExamWeb
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Your ultimate platform for online exams
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to access your exams and results
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleSignIn}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              Sign in with Google
            </Button>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Use an email containing "admin" to sign in as an admin.
              Otherwise, you'll be signed in as a student.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
