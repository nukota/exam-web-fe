import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { Layout } from '../../components/common/Layout';
import { CustomDataGrid } from '../../components/common';
import { mockExams } from '../../shared/mockdata';
import type { GridColDef } from '@mui/x-data-grid';

export const AdminExamsPage = () => {
  const navigate = useNavigate();

  const handleDelete = (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      console.log('Deleting exam:', examId);
      // Implement delete logic
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body1" fontWeight="medium">
            {params.row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'coding' ? 'Coding' : 'Standard'}
          color={params.value === 'coding' ? 'secondary' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'access_code',
      headerName: 'Access Code',
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} variant="outlined" size="small" />
      ),
    },
    {
      field: 'duration_minutes',
      headerName: 'Duration',
      width: 100,
      valueFormatter: (value) => `${value} min`,
    },
    {
      field: 'start_at',
      headerName: 'Start Time',
      width: 180,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleString() : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="info"
            onClick={() => navigate(`/admin/exams/${params.row.exam_id}/leaderboard`)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/admin/exams/${params.row.exam_id}/edit`)}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.exam_id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            All Exams
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/exams/create')}
          >
            Create New Exam
          </Button>
        </Box>

        <CustomDataGrid
          rows={mockExams}
          columns={columns}
          getRowId={(row) => row.exam_id}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>
    </Layout>
  );
};
