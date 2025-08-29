import React, { useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const MAX_ITEMS = 5;
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPT = {
  "image/*": [],
  "video/*": [],
};

const ImageVideoDropzone = ({ value = [], onChange, isRequired = false }) => {
  useEffect(() => {
    return () => value.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      let remaining = MAX_ITEMS - value.length;

      // 🔴 File size / type errors
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === "file-too-large") {
            toast.error(`"${file.name}" is larger than 5 MB.`);
          } else if (e.code === "file-invalid-type") {
            toast.error(`"${file.name}" is not an image or video.`);
          }
        });
      });

      if (remaining <= 0) {
        toast.error(`Only ${MAX_ITEMS} files are allowed.`);
        return;
      }

      // Take only allowed number
      const allowedFiles = acceptedFiles.slice(0, remaining).map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (acceptedFiles.length > remaining) {
        toast.error(
          `Only ${MAX_ITEMS} files are allowed. Extra files ignored.`
        );
      }

      onChange([...value, ...allowedFiles]);
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPT,
      maxSize: MAX_SIZE,
      multiple: true,
    });

  const borderColor = useMemo(() => {
    if (isDragReject) return "#ef4444"; // red
    if (isDragActive) return "#22c55e"; // green
    return "#cbd5e1"; // gray
  }, [isDragActive, isDragReject]);

  const removeFile = (name) => {
    onChange(value.filter((f) => f.name !== name));
  };

  return (
    <div>
      <label
        className={`mb-2 form-label label ${isRequired && "requiredText"}`}
      >
        Upload (Images / Videos)
        {isRequired && <span className="text-danger"> *</span>}
      </label>

      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: 8,
          padding: 20,
          textAlign: "center",
          cursor: "pointer",
          background: "#f8fafc",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag & drop or click to select (max {MAX_ITEMS} files, 5 MB each)
          </p>
        )}
      </div>

      {value.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {value.map((file) => (
            <div
              key={file.name + file.size}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 8,
                background: "#fff",
              }}
            >
              <div
                style={{
                  height: 100,
                  borderRadius: 6,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f1f5f9",
                }}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <video
                    src={file.preview}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    controls
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  marginTop: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  title={file.name}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 90,
                  }}
                >
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(file.name)}
                  style={{
                    fontSize: 12,
                    border: "none",
                    background: "transparent",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageVideoDropzone;
