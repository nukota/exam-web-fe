import { Button, Typography, Box } from '@mui/material'
import './App.css'

const App = () => {
  return (
    <Box className="w-screen min-h-screen flex items-center justify-center bg-white text-gray-900">
      <Box textAlign="center" className="space-y-6">
        <Typography variant="h2" component="h1" className="font-bold text-green-600">
          Welcome to ExamWeb
        </Typography>
        <Typography variant="h5" component="p" className="text-gray-600">
          Your ultimate platform for taking exams online. Prepare, practice, and succeed with our comprehensive exam system.
        </Typography>
        <Box className="space-x-4">
          <Button variant="contained" color="primary" size="large">
            Start Exam
          </Button>
          <Button variant="outlined" color="secondary" size="large">
            Learn More
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default App
