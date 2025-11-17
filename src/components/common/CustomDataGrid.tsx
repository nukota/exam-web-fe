import React from 'react';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';

interface CustomDataGridProps {
  rows: any[];
  columns: GridColDef[];
  onSelectionChange?: (selectedIds: string[]) => void;
  showCheckboxSelection?: boolean;
  getRowId?: (row: any) => string;
  pageSize?: number;
  pageSizeOptions?: number[];
  processRowUpdate?: (newRow: any, oldRow: any) => any;
  onProcessRowUpdateError?: (error: any) => void;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  rows,
  columns,
  onSelectionChange,
  showCheckboxSelection = false,
  getRowId,
  pageSize = 10,
  pageSizeOptions = [6, 10, 20],
  processRowUpdate,
  onProcessRowUpdateError,
}) => {
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    if (onSelectionChange) {
      // GridRowSelectionModel is an array-like structure
      const selectedIds = Array.isArray(newSelection) 
        ? newSelection.map((id) => String(id))
        : [];
      onSelectionChange(selectedIds);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        bgcolor: 'grey.50',
      }}
    >
      <Box
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
          minHeight: { xs: 400, sm: 500, lg: 600 },
          bgcolor: 'white',
        }}
      >
        <MuiDataGrid
          columnHeaderHeight={48}
          rowHeight={48}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize,
              },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={showCheckboxSelection}
          disableRowSelectionOnClick={!showCheckboxSelection}
          onRowSelectionModelChange={handleSelectionChange}
          density="comfortable"
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              fontSize: { xs: '14px', sm: '16px' },
              fontWeight: 600,
              color: '#101010',
            },
            '& .MuiDataGrid-cell': {
              fontSize: { xs: '12px', sm: '14px' },
              color: '#666',
              padding: { xs: '4px 6px', sm: '6px 8px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'left',
            },
            '& .MuiDataGrid-row': {
              minHeight: { xs: '48px', sm: '54px' },
              '&:nth-of-type(odd)': {
                backgroundColor: '#fff',
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#f8f8f8',
              },
              '&:nth-of-type(odd):hover': {
                backgroundColor: '#f5f5f5 !important',
              },
              '&:nth-of-type(even):hover': {
                backgroundColor: '#eeeeee !important',
              },
              '&.Mui-selected': {
                backgroundColor: '#e0e0e0 !important',
              },
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: { xs: '8px', sm: '16px' },
            },
            '@media (max-width: 768px)': {
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '11px',
                fontWeight: 600,
              },
              '& .MuiDataGrid-cell': {
                fontSize: '11px',
                padding: '6px 8px',
              },
              '& .MuiDataGrid-row': {
                minHeight: '44px',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomDataGrid;
