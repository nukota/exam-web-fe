import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { Layout, CustomDataGrid } from "../../components/common";
import { useStudents, useDeleteUser } from "../../services/usersService";
import { useFeedback } from "../../shared/providers/FeedbackProvider";
import type { GridColDef } from "@mui/x-data-grid";

export const AdminStudentsPage = () => {
  const { data: students, isLoading, error } = useStudents();
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      showSnackbar({
        message: "Student deleted successfully",
        severity: "success",
      });
    },
  });
  const { showAlert, showSnackbar } = useFeedback();

  const handleDelete = (studentId: string) => {
    showAlert({
      title: "Delete Student",
      message:
        "Are you sure you want to delete this student? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      severity: "warning",
      onConfirm: () => {
        deleteUserMutation.mutate(studentId);
      },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Failed to load students. Please try again later.
          </Alert>
        </Box>
      </Layout>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "Student",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
          <Avatar
            src={params.row.photo_url}
            alt={params.value || params.row.username}
            sx={{ width: 36, height: 36 }}
          >
            {(params.value || params.row.username)?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Typography variant="body2" fontWeight="medium">
              {params.value || params.row.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "school_name",
      headerName: "School",
      flex: 0.3,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "N/A"}</Typography>
      ),
    },
    {
      field: "class_name",
      headerName: "Class",
      flex: 0.3,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "N/A"}</Typography>
      ),
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      flex: 0.5,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      field: "created_at",
      headerName: "Joined Date",
      flex: 0.5,
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
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
          disabled={deleteUserMutation.isPending}
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
            {`${students?.length || 0} Students`}
          </Typography>
        </Box>

        <CustomDataGrid
          rows={students || []}
          columns={columns}
          getRowId={(row) => row.user_id}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>
    </Layout>
  );
};
