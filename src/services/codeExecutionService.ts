// Judge0 Language IDs
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
};

export const executeCodeWithJudge0 = async (
  code: string,
  lang: string,
  input: string
): Promise<string> => {
  try {
    const languageId = JUDGE0_LANGUAGE_IDS[lang];
    if (!languageId) {
      return `Language ${lang} is not supported`;
    }

    // Create submission
    const createResponse = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
          stdin: input,
        }),
      }
    );

    if (!createResponse.ok) {
      return `Error: Failed to submit code (${createResponse.status})`;
    }

    const result = await createResponse.json();

    // Check for compilation or runtime errors
    if (result.compile_output) {
      return `Compilation Error:\n${result.compile_output}`;
    }

    if (result.stderr) {
      return `Runtime Error:\n${result.stderr}`;
    }

    if (result.stdout) {
      return result.stdout;
    }

    return "Code executed successfully (no output)";
  } catch (error: any) {
    return `Execution error: ${error.message}`;
  }
};
