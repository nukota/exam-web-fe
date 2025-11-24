import { Box, Typography, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";
import { Layout, CustomDataGrid } from "../../components/common";
import type { GridColDef } from "@mui/x-data-grid";

interface Student {
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  class_name: string;
  school_name: string;
  dob?: string;
  enrolled_date?: string;
  exams_taken: number;
  average_score?: number;
}

// Mock data
const mockStudents: Student[] = [
  {
    user_id: "1",
    username: "alice_j",
    full_name: "Alice Johnson",
    email: "alice.johnson@example.com",
    class_name: "Class 12A",
    school_name: "Tech University",
    dob: "2005-03-15",
    enrolled_date: "2024-09-01",
    exams_taken: 5,
    average_score: 85.5,
  },
  {
    user_id: "2",
    username: "bob_smith",
    full_name: "Bob Smith",
    email: "bob.smith@example.com",
    class_name: "Class 12B",
    school_name: "Tech University",
    dob: "2005-07-22",
    enrolled_date: "2024-09-01",
    exams_taken: 3,
    average_score: 78.3,
  },
  {
    user_id: "3",
    username: "carol_white",
    full_name: "Carol White",
    email: "carol.white@example.com",
    class_name: "Class 12A",
    school_name: "Tech University",
    dob: "2005-11-08",
    enrolled_date: "2024-09-05",
    exams_taken: 4,
    average_score: 92.0,
  },
  {
    user_id: "4",
    username: "david_brown",
    full_name: "David Brown",
    email: "david.brown@example.com",
    class_name: "Class 12C",
    school_name: "Tech University",
    dob: "2005-01-30",
    enrolled_date: "2024-09-10",
    exams_taken: 2,
    average_score: 70.5,
  },
  {
    user_id: "5",
    username: "emma_davis",
    full_name: "Emma Davis",
    email: "emma.davis@example.com",
    class_name: "Class 12B",
    school_name: "Tech University",
    dob: "2005-09-18",
    enrolled_date: "2024-09-15",
    exams_taken: 6,
    average_score: 88.7,
  },
];

export const AdminStudentsPage = () => {
  const handleDelete = (studentId: string) => {
    // TODO: Implement delete logic with API integration
    console.log("Deleting student:", studentId);
  };

  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "Student",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "school_class",
      flex: 0.6,
      headerName: "School & Class",
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Typography variant="body2" fontWeight="medium">
            {params.row.school_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.class_name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 130,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      field: "enrolled_date",
      headerName: "Enrolled Date",
      width: 130,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      field: "exams_taken",
      headerName: "Exams Taken",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "average_score",
      headerName: "Avg Score",
      flex: 0.5,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          fontWeight="bold"
          color={
            params.value >= 80
              ? "#4caf50"
              : params.value >= 60
              ? "#ff9800"
              : "#f44336"
          }
        >
          {params.value ? `${params.value.toFixed(1)}%` : "N/A"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => handleDelete(params.row.user_id)}
          title="Delete Student"
        >
          <Trash2 size={20} />
        </IconButton>
      ),
    },
  ];

  return (
    <Layout>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            All Students
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              bgcolor: "grey.300",
              ml: 2,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              flexShrink: 0,
            }}
          >
            {`${mockStudents.length} Students`}
          </Typography>
        </Box>

        <CustomDataGrid
          rows={mockStudents}
          columns={columns}
          getRowId={(row) => row.user_id}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>
    </Layout>
  );
};
