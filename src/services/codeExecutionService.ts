// Judge0 Language IDs
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
};

// Normalize language identifiers
const normalizeLanguage = (lang: string): string => {
  if (lang === "c++") return "cpp";
  return lang;
};

// Helper function to encode to Base64
const encodeBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

// Helper function to decode from Base64
const decodeBase64 = (str: string): string => {
  return decodeURIComponent(escape(atob(str)));
};

export const executeCodeWithJudge0 = async (
  code: string,
  lang: string,
  input: string
): Promise<string> => {
  try {
    const normalizedLang = normalizeLanguage(lang);
    const languageId = JUDGE0_LANGUAGE_IDS[normalizedLang];
    if (!languageId) {
      return `Language ${lang} is not supported`;
    }

    // Create submission with Base64 encoding
    const createResponse = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: encodeBase64(code),
          stdin: encodeBase64(input),
        }),
      }
    );

    if (!createResponse.ok) {
      return `Error: Failed to submit code (${createResponse.status})`;
    }

    const result = await createResponse.json();

    // Decode Base64-encoded outputs
    if (result.compile_output) {
      return `Compilation Error:\n${decodeBase64(result.compile_output)}`;
    }

    if (result.stderr) {
      return `Runtime Error:\n${decodeBase64(result.stderr)}`;
    }

    if (result.stdout) {
      return decodeBase64(result.stdout);
    }

    return "Code executed successfully (no output)";
  } catch (error: any) {
    return `Execution error: ${error.message}`;
  }
};
