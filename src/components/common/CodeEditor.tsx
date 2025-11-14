import Editor from '@monaco-editor/react';
import { Box, Paper, Typography } from '@mui/material';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  height = '400px',
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Code Editor
      </Typography>
      <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
        <Editor
          height={height}
          defaultLanguage={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Box>
    </Paper>
  );
};
