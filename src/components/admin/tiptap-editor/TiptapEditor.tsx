import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import {
  Box,
  IconButton,
  Divider,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  FormatQuote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "@mui/icons-material";
import { useEffect, useCallback, useState } from "react";
import { uploadImageToCloudinary } from "../../../services/cloudinaryService";
import "./tiptap.css";

interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Enter text here...",
}: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: false, // Disable base64 to prevent 413 errors
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left"],
        defaultAlignment: "left",
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
  });

  // Update editor content when value prop changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor) return;

    // Create a hidden file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Check file size (optional: warn if over 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert("Image is too large. Please select an image under 10MB.");
        return;
      }

      try {
        setIsUploading(true);

        // Upload to Cloudinary
        const imageUrl = await uploadImageToCloudinary(file);

        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "white",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          p: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          flexWrap: "wrap",
        }}
      >
        <Select
          size="small"
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : "paragraph"
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else if (value === "h1") {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            } else if (value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            } else if (value === "h3") {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
          sx={{
            minWidth: 120,
            height: 32,
            fontSize: "0.875rem",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },
          }}
        >
          <MenuItem value="paragraph">Normal</MenuItem>
          <MenuItem value="h1">Heading 1</MenuItem>
          <MenuItem value="h2">Heading 2</MenuItem>
          <MenuItem value="h3">Heading 3</MenuItem>
        </Select>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <IconButton
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          sx={{
            color: "text.secondary",
          }}
        >
          <Undo fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          sx={{
            color: "text.secondary",
          }}
        >
          <Redo fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          sx={{
            color: editor.isActive("bold") ? "primary.main" : "text.secondary",
            bgcolor: editor.isActive("bold")
              ? "action.selected"
              : "transparent",
          }}
        >
          <FormatBold fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          sx={{
            color: editor.isActive("italic")
              ? "primary.main"
              : "text.secondary",
            bgcolor: editor.isActive("italic")
              ? "action.selected"
              : "transparent",
          }}
        >
          <FormatItalic fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          sx={{
            color: editor.isActive("underline")
              ? "primary.main"
              : "text.secondary",
            bgcolor: editor.isActive("underline")
              ? "action.selected"
              : "transparent",
          }}
        >
          <FormatUnderlined fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleCode().run()}
          sx={{
            color: editor.isActive("code") ? "primary.main" : "text.secondary",
            bgcolor: editor.isActive("code")
              ? "action.selected"
              : "transparent",
          }}
        >
          <Code fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          sx={{
            color: editor.isActive("bulletList")
              ? "primary.main"
              : "text.secondary",
            bgcolor: editor.isActive("bulletList")
              ? "action.selected"
              : "transparent",
          }}
        >
          <FormatListBulleted fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          sx={{
            color: editor.isActive("orderedList")
              ? "primary.main"
              : "text.secondary",
            bgcolor: editor.isActive("orderedList")
              ? "action.selected"
              : "transparent",
          }}
        >
          <FormatListNumbered fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          sx={{
            color: editor.isActive("blockquote")
              ? "primary.main"
              : "text.secondary",
            bgcolor: editor.isActive("blockquote")
              ? "action.selected"
              : "transparent",
          }}
        >
          <FormatQuote fontSize="small" />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <IconButton
          size="small"
          onClick={setLink}
          sx={{
            color: editor.isActive("link") ? "primary.main" : "text.secondary",
            bgcolor: editor.isActive("link")
              ? "action.selected"
              : "transparent",
          }}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={addImage}
          disabled={isUploading}
          sx={{
            color: "text.secondary",
          }}
        >
          {isUploading ? (
            <CircularProgress size={20} />
          ) : (
            <ImageIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </Box>
  );
}
