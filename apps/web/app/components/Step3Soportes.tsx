"use client";

import React, { ChangeEvent, useState } from "react";
import { usePQRSStore } from "../stores/pqrsStore";
import { uploadPQRSFile } from "../lib/uploadPQRSFile";

const fieldClassName =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-ransa-500 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-400 shadow-sm text-sm";

interface FileInputFieldProps {
  label: string;
  name: string;
  folder: string;
  required?: boolean;
  onUrlChange: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  helperText?: string;
}

function FileInputField({
  label,
  name,
  folder,
  required = false,
  onUrlChange,
  onUploadStart,
  onUploadEnd,
  helperText,
}: FileInputFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");
    setUrl("");
    onUrlChange("");
    setFileName("");

    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    onUploadStart?.();

    try {
      const uploadedUrl = await uploadPQRSFile(file, folder);
      setUrl(uploadedUrl);
      onUrlChange(uploadedUrl);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al subir el archivo.",
      );
      setFileName("");
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  const handleRemove = () => {
    setUrl("");
    onUrlChange("");
    setFileName("");
    setUploadError("");
  };

  return (
    <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 shadow-sm transition hover:border-ransa-200">
      <label className="mb-1 block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-ransa-accent">*</span>}
      </label>
      {helperText && (
        <p className="mb-2.5 text-[11px] text-gray-500 leading-normal">
          {helperText}
        </p>
      )}

      {!url ? (
        <div className="relative">
          <input
            type="file"
            id={`file-input-${name}`}
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all duration-200 ${
              isUploading
                ? "border-ransa-400 bg-ransa-50/20"
                : "border-gray-300 hover:border-ransa-400 hover:bg-ransa-50/10"
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="animate-spin h-6 w-6 text-ransa-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="text-xs font-semibold text-gray-600 animate-pulse text-center max-w-50 truncate">
                  Subiendo: {fileName}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-xs font-bold text-ransa-700 hover:text-ransa-800">
                  Seleccionar archivo
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  PDF, PNG, JPG, XLS, etc.
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-ransa-200 bg-ransa-50/50 p-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="rounded-full bg-ransa-100 p-1.5 text-ransa-700 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-bold text-gray-700">
                ¡Listo! Archivo cargado
              </span>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-[10px] text-ransa-700 hover:underline font-semibold"
              >
                Ver soporte adjunto
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      {uploadError && (
        <p className="mt-1.5 text-xs text-red-500 font-semibold">
          {uploadError}
        </p>
      )}
    </div>
  );
}

export function Step3Soportes() {
  const formData = usePQRSStore((state) => state.formData);
  const setFileUrl = usePQRSStore((state) => state.setFileUrl);
  const [activeUploadsCount, setActiveUploadsCount] = useState(0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
        Paso 03 / 03 - Soportes y Archivos Adjuntos
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FileInputField
          label="Soporte de la novedad reportada I"
          name="soporteFile"
          folder="support-file-1"
          required
          onUrlChange={(url) => setFileUrl("supportFileUrl", url)}
          onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
          onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
        />

        <FileInputField
          label="Soporte de la novedad reportada II"
          name="soporteFile2"
          folder="support-file-2"
          required
          onUrlChange={(url) => setFileUrl("supportFile2Url", url)}
          onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
          onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
        />

        <FileInputField
          label="Certificado de revisor fiscal o legal"
          name="certificadoFile"
          folder="certificate"
          helperText="(Requerido cuando el valor de la PQRS sea mayor a $999.999)"
          onUrlChange={(url) => setFileUrl("certificateFileUrl", url)}
          onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
          onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
        />

        <FileInputField
          label="Formato cuadro valor costo diligenciado"
          name="cuadroValorFile"
          folder="value-sheet"
          required
          onUrlChange={(url) => setFileUrl("valueSheetFileUrl", url)}
          onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
          onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
        />
      </div>

      <div className="rounded-xl border-l-4 border-ransa-650 bg-ransa-50/40 p-4.5 text-xs sm:text-sm leading-relaxed text-gray-700">
        <p className="mb-1.5 font-bold text-ransa-900 text-sm">
          Aviso de Privacidad y Protección de datos personales:
        </p>
        <p className="text-gray-650 leading-normal text-xs">
          Informamos que en cumplimiento de la Ley 1581 de 2012 &quot;Ley de
          Protección de Datos personales&quot; y con base en lo establecido en
          el artículo 10 del Decreto Reglamentario 1377 de 2013, el registro del
          presente formulario es soporte de autorización para el ingreso y
          tratamiento de los datos aquí suministrados. Consulte nuestra Política
          de Protección de Datos Personales.
        </p>
      </div>

      <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="font-semibold text-blue-900 mb-1">Nota:</p>
        <p>
          Archivos cargados:{" "}
          {
            Object.values(formData).filter(
              (v) => typeof v === "string" && v.startsWith("http"),
            ).length
          }{" "}
          de 3 requeridos
        </p>
      </div>
    </div>
  );
}
