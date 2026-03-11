import { useState, useCallback } from "react";
import { convertFile, downloadBlob } from "../services/api";

export function useConversion(tool) {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(null); // { phase, percent }
  const [status, setStatus] = useState("idle"); // idle | uploading | converting | done | error
  const [error, setError] = useState(null);
  const [resultFilename, setResultFilename] = useState(null);

  const addFiles = useCallback((newFiles) => {
    if (tool?.multi) {
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      setFiles([newFiles[0]]);
    }
    setStatus("idle");
    setError(null);
  }, [tool]);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setProgress(null);
    setStatus("idle");
    setError(null);
    setResultFilename(null);
  }, []);

  const convert = useCallback(async (options = {}) => {
    if (!files.length) return;
    setError(null);
    setStatus("uploading");

    try {
      const response = await convertFile(
        tool.id,
        tool.multi ? files : files[0],
        options,
        (prog) => {
          setProgress(prog);
          if (prog.percent === 100) setStatus("converting");
        }
      );

      // Extract filename from content-disposition header
      const disposition = response.headers["content-disposition"];
      const match = disposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      const filename = match
        ? match[1].replace(/['"]/g, "")
        : `converted.${tool.to.toLowerCase()}`;

      setResultFilename(filename);
      setStatus("done");

      // Auto-download
      downloadBlob(response.data, filename);
    } catch (err) {
      setStatus("error");
      setError(
        err.response?.data?.message ||
          "Conversion failed. Please try again."
      );
    }
  }, [files, tool]);

  return {
    files,
    progress,
    status,
    error,
    resultFilename,
    addFiles,
    removeFile,
    reset,
    convert,
  };
}