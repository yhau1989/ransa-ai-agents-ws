"use client";

import React, { useActionState, useRef, useState, ChangeEvent, useTransition } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { submitPQRS } from "../actions/submitPQRS";
import { uploadPQRSFile } from "../lib/uploadPQRSFile";

interface FormValues {
  eventDate: string;
  confirmDate: string;
  empresa: string;
  relacion: string;
  tipoSolicitud: string;
  nombreCliente: string;
  nitCc: string;
  descripcion: string;
  valorVenta: string;
  valorCosto: string;
  telefono: string;
  region: string;
  transportProcess: string;
  proceso: string;
  tipoServicio: string;
  channel: "web" | "whatsapp";
  ciudades: string;
  soporteFile: FileList;
  soporteFile2: FileList;
  certificadoFile: FileList;
  cuadroValorFile: FileList;
}

type SubmissionState = {
  success: boolean;
  message: string;
};

type FileUploadUrls = {
  supportFileUrl: string;
  supportFile2Url: string;
  certificateFileUrl: string;
  valueSheetFileUrl: string;
};

const initialSubmissionState: SubmissionState = {
  success: false,
  message: "",
};

const fieldClassName =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-ransa-500 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-400 shadow-sm text-sm";

const errorFieldClassName =
  "border-red-300 focus:ring-red-500 hover:border-red-400";

const primaryButtonClassName =
  "rounded-lg bg-ransa-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-ransa-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ransa-500 focus:ring-offset-2";

const submitButtonClassName =
  "rounded-lg bg-gradient-to-r from-ransa-600 to-ransa-700 px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:from-ransa-700 hover:to-ransa-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ransa-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 active:scale-98 hover:-translate-y-0.5";

/* ==========================================
   SUBCOMPONENT: EmailSection (Local State)
   ========================================== */
interface EmailSectionProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}

function EmailSection({ emails, onChange }: EmailSectionProps) {
  const [emailInput, setEmailInput] = useState("");
  const [localError, setLocalError] = useState("");

  const handleAddEmail = () => {
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) return;

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setLocalError("Formato de correo electrónico inválido.");
      return;
    }

    if (emails.includes(cleanEmail)) {
      setLocalError("Este correo electrónico ya ha sido agregado.");
      return;
    }

    const nextEmails = [...emails, cleanEmail];
    onChange(nextEmails);
    setEmailInput("");
    setLocalError("");
  };

  const handleRemoveEmail = (index: number) => {
    const nextEmails = emails.filter((_, i) => i !== index);
    onChange(nextEmails);
  };

  return (
    <div className="space-y-2 animate-fadeIn">
      <label className="block text-sm font-semibold text-gray-700">
        Correo electrónico de contacto <span className="text-ransa-accent">*</span>
      </label>
      <div className="flex gap-2">
        <input
          type="email"
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            if (localError) setLocalError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddEmail();
            }
          }}
          placeholder="Digite el correo para recibir respuesta"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-ransa-500 shadow-sm text-sm"
        />
        <button
          type="button"
          onClick={handleAddEmail}
          className={primaryButtonClassName}
        >
          Agregar
        </button>
      </div>

      {localError && (
        <p className="text-xs text-red-500 font-semibold">{localError}</p>
      )}

      {emails.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 animate-fadeIn">
          {emails.map((email, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full border border-ransa-200 bg-ransa-50 px-3.5 py-1.5 shadow-sm transition hover:bg-ransa-100"
            >
              <span className="text-xs font-semibold text-ransa-800">{email}</span>
              <button
                type="button"
                onClick={() => handleRemoveEmail(index)}
                className="rounded-full p-0.5 text-ransa-accent hover:bg-ransa-200 hover:text-ransa-accent-dark transition focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUBCOMPONENT: FileInputField (Local State)
   ========================================== */
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
        error instanceof Error ? error.message : "Ocurrió un error al subir el archivo."
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
      {helperText && <p className="mb-2.5 text-[11px] text-gray-500 leading-normal">{helperText}</p>}

      {!url ? (
        <div className="relative">
          <input
            type="file"
            id={`file-input-${name}`}
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
          <div className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all duration-200 ${isUploading
              ? "border-ransa-400 bg-ransa-50/20"
              : "border-gray-300 hover:border-ransa-400 hover:bg-ransa-50/10"
            }`}>
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
                <span className="text-xs font-semibold text-gray-600 animate-pulse text-center max-w-[200px] truncate">
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
                <span className="text-[10px] text-gray-400 font-medium">PDF, PNG, JPG, XLS, etc.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-ransa-200 bg-ransa-50/50 p-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="rounded-full bg-ransa-100 p-1.5 text-ransa-700 flex-shrink-0">
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
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
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
        <p className="mt-1.5 text-xs text-red-500 font-semibold">{uploadError}</p>
      )}
    </div>
  );
}

/* ==========================================
   SUBCOMPONENT: SubmitButton
   ========================================== */
function SubmitButton({ isUploading, isSubmitting }: { isUploading: boolean; isSubmitting: boolean }) {
  const disabled = isSubmitting || isUploading;

  return (
    <button type="submit" className={submitButtonClassName} disabled={disabled}>
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Enviando solicitud...</span>
        </div>
      ) : isUploading ? (
        "Subiendo archivos..."
      ) : (
        "Aceptar y Enviar"
      )}
    </button>
  );
}

/* ==========================================
   MAIN COMPONENT: PQRSForm
   ========================================== */
export default function PQRSForm() {
  const [submissionState, formAction] = useActionState(
    submitPQRS,
    initialSubmissionState,
  );
  const [isSubmitting, startSubmission] = useTransition();
  const [fileUrls, setFileUrls] = useState<FileUploadUrls>({
    supportFileUrl: "",
    supportFile2Url: "",
    certificateFileUrl: "",
    valueSheetFileUrl: "",
  });
  const [activeUploadsCount, setActiveUploadsCount] = useState(0);
  const [emails, setEmails] = useState<string[]>([]);
  const [clientError, setClientError] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const { register, getValues, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      eventDate: "",
      confirmDate: "",
      empresa: "",
      relacion: "",
      tipoSolicitud: "",
      nombreCliente: "",
      nitCc: "",
      descripcion: "",
      valorVenta: "",
      valorCosto: "",
      telefono: "",
      region: "",
      transportProcess: "",
      proceso: "",
      tipoServicio: "",
      channel: "web",
      ciudades: "",
    },
  });

  React.useEffect(() => {
    if (submissionState.success) {
      reset();
      setEmails([]);
      setFileUrls({
        supportFileUrl: "",
        supportFile2Url: "",
        certificateFileUrl: "",
        valueSheetFileUrl: "",
      });
      setResetKey((prev) => prev + 1);
    }
  }, [submissionState, reset]);

  const setFileUrl = (field: keyof FileUploadUrls, url: string) => {
    setFileUrls((prev) => ({ ...prev, [field]: url }));
  };

  const handleClientValidation = () => {
    setClientError("");

    if (emails.length === 0) {
      setClientError("Debes agregar al menos un correo electrónico de contacto.");
      return;
    }

    if (!fileUrls.supportFileUrl || !fileUrls.supportFile2Url || !fileUrls.valueSheetFileUrl) {
      setClientError(
        "Debes adjuntar los soportes obligatorios y el formato de cuadro de valor costo.",
      );
      return;
    }

    if (activeUploadsCount > 0) {
      setClientError("Espera a que termine la carga de archivos para enviar.");
      return;
    }

    const currentForm = formRef.current;
    if (!currentForm) {
      setClientError("No se pudo preparar el envío del formulario.");
      return;
    }

    const formData = new FormData(currentForm);
    startSubmission(() => {
      void formAction(formData);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ransa-50 via-white to-ransa-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/ransa-logo.svg"
              alt="RANSA Logo"
              width={200}
              height={60}
              className="h-16 w-auto transition-transform hover:scale-105 duration-300"
              priority
            />
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-ransa-800 tracking-tight sm:text-4xl">
            PQRS - Ransa Colombia
          </h1>
          <p className="text-sm font-bold text-ransa-600 uppercase tracking-wider">
            Peticiones, Quejas, Reconocimientos y Sugerencias
          </p>
        </div>

        {/* Welcome Card */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md border border-ransa-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-ransa-500 to-ransa-700"></div>
          <p className="mb-2 text-gray-800 text-lg">
            <span className="font-bold text-ransa-800">Bienvenido a nuestro Sistema de PQRS.</span>
          </p>
          <p className="text-gray-600 leading-relaxed text-sm">
            Este es el primer paso para procesar tu solicitud. Por favor, ingresa los datos
            requeridos a continuación y nuestro equipo trabajará para brindarte una respuesta oportuna.
          </p>
        </div>

        {/* Form Container */}
        {/* noValidate stops standard browser alerts and lets us show styled react-hook-form errors */}
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit(handleClientValidation)}
          className="space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
        >
          {/* Hidden inputs to feed FormData correctly on submission */}
          <input type="hidden" name="emails" value={JSON.stringify(emails)} />
          <input type="hidden" name="channel" value="web" />
          <input type="hidden" name="supportFileUrl" value={fileUrls.supportFileUrl} />
          <input type="hidden" name="supportFile2Url" value={fileUrls.supportFile2Url} />
          <input type="hidden" name="certificateFileUrl" value={fileUrls.certificateFileUrl} />
          <input type="hidden" name="valueSheetFileUrl" value={fileUrls.valueSheetFileUrl} />

          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Información General del Evento
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Fecha del evento <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="date"
                  {...register("eventDate", { required: "La fecha del evento es obligatoria." })}
                  className={`${fieldClassName} ${errors.eventDate ? errorFieldClassName : ""}`}
                />
                {errors.eventDate && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.eventDate.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirme la fecha <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="date"
                  {...register("confirmDate", {
                    required: "Debe confirmar la fecha del evento.",
                    validate: (value) =>
                      value === getValues("eventDate") || "La confirmación de fecha no coincide con la fecha del evento.",
                  })}
                  className={`${fieldClassName} ${errors.confirmDate ? errorFieldClassName : ""}`}
                />
                {errors.confirmDate && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.confirmDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Empresa <span className="text-ransa-accent">*</span>
              </label>
              <select
                {...register("empresa", { required: "Debe seleccionar una empresa." })}
                className={`${fieldClassName} ${errors.empresa ? errorFieldClassName : ""}`}
              >
                <option value="">Seleccione opción</option>
                <option value="Ransa Colombia S.A.S">1. Ransa Colombia S.A.S</option>
                <option value="Ransa Cargo S.A.S">2. Ransa Cargo S.A.S</option>
                <option value="Wcargo S.A.S">3. Wcargo S.A.S</option>
              </select>
              {errors.empresa && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.empresa.message}</p>
              )}
              <p className="mt-1.5 text-xs text-gray-500 italic">
                (Ransa Colombia es Almacenamiento y Laboratorio; Ransa Cargo es Transporte)
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Relación <span className="text-ransa-accent">*</span>
              </label>
              <select
                {...register("relacion", { required: "Debe seleccionar la relación." })}
                className={`${fieldClassName} ${errors.relacion ? errorFieldClassName : ""}`}
              >
                <option value="">Seleccione opción</option>
                <option value="cliente">Cliente</option>
                <option value="procesos">Procesos Internos</option>
                <option value="proveedor">Proveedor / Contratista</option>
                <option value="tercero">Tercero / Transportador / Conductor</option>
                <option value="visitante">Visitante</option>
              </select>
              {errors.relacion && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.relacion.message}</p>
              )}
              <p className="mt-1.5 text-xs text-gray-500 italic">(¿Quién radica la solicitud?)</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Tipo de solicitud <span className="text-ransa-accent">*</span>
              </label>
              <select
                {...register("tipoSolicitud", { required: "Debe seleccionar el tipo de solicitud." })}
                className={`${fieldClassName} ${errors.tipoSolicitud ? errorFieldClassName : ""}`}
              >
                <option value="">Seleccione opción</option>
                <option value="consulta">Consulta / Comercial - Técnica</option>
                <option value="facturacion">Novedad de Facturación</option>
                <option value="queja">Queja</option>
                <option value="reclamo">Reclamo</option>
                <option value="reconocimiento">Reconocimiento / Felicitación</option>
                <option value="sugerencias">Sugerencias / Oportunidad de Mejora</option>
              </select>
              {errors.tipoSolicitud && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.tipoSolicitud.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Detalles del Solicitante y la Novedad
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nombre Cliente / Proveedor / Tercero <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="text"
                  {...register("nombreCliente", { required: "El nombre es obligatorio." })}
                  placeholder="Digitar en MAYÚSCULA"
                  className={`${fieldClassName} ${errors.nombreCliente ? errorFieldClassName : ""} placeholder:text-gray-300`}
                />
                {errors.nombreCliente && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.nombreCliente.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  NIT / CC <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="text"
                  {...register("nitCc", { required: "El NIT o número de identificación es obligatorio." })}
                  placeholder="Incluir dígito de verificación"
                  className={`${fieldClassName} ${errors.nitCc ? errorFieldClassName : ""} placeholder:text-gray-300`}
                />
                {errors.nitCc && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.nitCc.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Descripción de la PQRS <span className="text-ransa-accent">*</span>
              </label>
              <textarea
                {...register("descripcion", { required: "La descripción detallada es obligatoria." })}
                rows={4}
                placeholder="Detalle de forma clara la novedad presentada"
                className={`${fieldClassName} ${errors.descripcion ? errorFieldClassName : ""} resize-none`}
              />
              {errors.descripcion && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.descripcion.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Valor venta / Comercial <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="number"
                  {...register("valorVenta", { required: "El valor comercial es obligatorio." })}
                  step="0.01"
                  className={`${fieldClassName} ${errors.valorVenta ? errorFieldClassName : ""}`}
                />
                {errors.valorVenta && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.valorVenta.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Valor costo / Producción <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="number"
                  {...register("valorCosto", { required: "El valor de costo o producción es obligatorio." })}
                  step="0.01"
                  className={`${fieldClassName} ${errors.valorCosto ? errorFieldClassName : ""}`}
                />
                {errors.valorCosto && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.valorCosto.message}</p>
                )}
              </div>
            </div>

            {/* Email Section (Optimized internal component) */}
            <EmailSection emails={emails} onChange={setEmails} />

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Teléfono de Contacto <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="tel"
                {...register("telefono", { required: "El teléfono de contacto es obligatorio." })}
                placeholder="Ej: 3001234567"
                className={`${fieldClassName} ${errors.telefono ? errorFieldClassName : ""}`}
              />
              {errors.telefono && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.telefono.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Ubicación y Procesos Internos
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Región / Ciudad <span className="text-ransa-accent">*</span>
                </label>
                <select
                  {...register("region", { required: "Debe seleccionar una región o ciudad." })}
                  className={`${fieldClassName} ${errors.region ? errorFieldClassName : ""}`}
                >
                  <option value="">Seleccione opción</option>
                  <option value="barranquilla">Barranquilla-Galapa</option>
                  <option value="bogota">Bogotá</option>
                  <option value="cali">Cali-Yumbo</option>
                  <option value="cartagena">Cartagena</option>
                  <option value="funza">Funza</option>
                  <option value="medellin">Medellin-Pereira</option>
                  <option value="sabaneta">Medellín-Sabaneta</option>
                  <option value="tocancipa">Tocancipá</option>
                  <option value="urapanes">Urapanes</option>
                </select>
                {errors.region && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.region.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ciudad Origen y Entrega <span className="text-ransa-accent">*</span>
                </label>
                <input
                  type="text"
                  {...register("ciudades", { required: "Las ciudades de origen y entrega son obligatorias." })}
                  placeholder="Ej: Bogotá - Medellín"
                  className={`${fieldClassName} ${errors.ciudades ? errorFieldClassName : ""}`}
                />
                {errors.ciudades && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.ciudades.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Procesos de Transporte
              </label>
              <select
                {...register("transportProcess")}
                className={fieldClassName}
              >
                <option value="">Seleccione opción</option>
                <option value="no-aplica">NO APLICA A TRANSPORTE</option>
                <option value="nacional">
                  TRANSPORTE NACIONAL: Corresponde a vehículos exclusivos.
                </option>
                <option value="consolidacion">
                  CONSOLIDACIÓN: Corresponde a transporte Nacional por Kg (fuera de la ciudad).
                </option>
                <option value="local">
                  TRANSPORTE LOCAL: Corresponde al transporte dentro de la misma ciudad
                </option>
              </select>
              <p className="mt-1.5 text-xs text-gray-500 italic">
                (Aplica cuando la novedad le pertenece a Ransa Cargo - Transporte)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Proceso <span className="text-ransa-accent">*</span>
                </label>
                <select
                  {...register("proceso", { required: "Debe asignar un proceso responsable." })}
                  className={`${fieldClassName} ${errors.proceso ? errorFieldClassName : ""}`}
                >
                  <option value="">Seleccione opción</option>
                  <option value="aseguramiento">Aseguramiento Sistemas Gestión Integral</option>
                  <option value="compras">Compras</option>
                  <option value="direccion">Dirección Estratégica</option>
                  <option value="facturacion">Facturación</option>
                  <option value="admin">Gestion Admón. y Financiera</option>
                  <option value="comercial">Gestión Comercial</option>
                  <option value="humana">Gestión Humana</option>
                  <option value="almacenamiento">Gestión Operaciones- Almacenamiento</option>
                  <option value="consolidacion">Gestión Operaciones-Consolidación</option>
                  <option value="local-transport">Gestión Operaciones-Transporte Local</option>
                  <option value="nacional-transport">Gestión Operaciones-Transporte Nacional</option>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="seguridad">Seguridad</option>
                  <option value="sistemas">Sistemas Información</option>
                </select>
                {errors.proceso && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.proceso.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tipo de servicio <span className="text-ransa-accent">*</span>
                </label>
                <select
                  {...register("tipoServicio", { required: "Debe seleccionar el tipo de servicio." })}
                  className={`${fieldClassName} ${errors.tipoServicio ? errorFieldClassName : ""}`}
                >
                  <option value="">Seleccione opción</option>
                  <option value="almacenamiento">Almacenamiento</option>
                  <option value="consolidacion-local">Consolidación Local</option>
                  <option value="consolidacion-nacional">Consolidación Nacional</option>
                  <option value="logistica">Logística Urbana</option>
                  <option value="no-aplica">No aplica</option>
                  <option value="otro">Otro</option>
                  <option value="exclusivo">Transporte Exclusivo</option>
                </select>
                {errors.tipoServicio && (
                  <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.tipoServicio.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optimized File Upload Section */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Soportes y Archivos Adjuntos
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FileInputField
                key={`support-file-1-${resetKey}`}
                label="Soporte de la novedad reportada I"
                name="soporteFile"
                folder="support-file-1"
                required
                onUrlChange={(url) => setFileUrl("supportFileUrl", url)}
                onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
                onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
              />

              <FileInputField
                key={`support-file-2-${resetKey}`}
                label="Soporte de la novedad reportada II"
                name="soporteFile2"
                folder="support-file-2"
                required
                onUrlChange={(url) => setFileUrl("supportFile2Url", url)}
                onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
                onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
              />

              <FileInputField
                key={`certificate-${resetKey}`}
                label="Certificado de revisor fiscal o legal"
                name="certificadoFile"
                folder="certificate"
                helperText="(Requerido cuando el valor de la PQRS sea mayor a $999.999)"
                onUrlChange={(url) => setFileUrl("certificateFileUrl", url)}
                onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
                onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
              />

              <FileInputField
                key={`value-sheet-${resetKey}`}
                label="Formato cuadro valor costo diligenciado"
                name="cuadroValorFile"
                folder="value-sheet"
                required
                onUrlChange={(url) => setFileUrl("valueSheetFileUrl", url)}
                onUploadStart={() => setActiveUploadsCount((c) => c + 1)}
                onUploadEnd={() => setActiveUploadsCount((c) => c - 1)}
              />
            </div>
          </div>

          {/* Privacy and Protection Notice */}
          <div className="rounded-xl border-l-4 border-ransa-650 bg-ransa-50/40 p-4.5 text-xs sm:text-sm leading-relaxed text-gray-700">
            <p className="mb-1.5 font-bold text-ransa-900 text-sm">
              Aviso de Privacidad y Protección de datos personales:
            </p>
            <p className="text-gray-650 leading-normal text-xs">
              Informamos que en cumplimiento de la Ley 1581 de 2012 &quot;Ley de Protección
              de Datos personales&quot; y con base en lo establecido en el artículo 10 del
              Decreto Reglamentario 1377 de 2013, el registro del presente formulario es
              soporte de autorización para el ingreso y tratamiento de los datos aquí
              suministrados. Consulte nuestra Política de Protección de Datos Personales.
            </p>
          </div>

          {/* Validation and Submission Feedback */}
          {clientError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-pulse flex items-start gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{clientError}</span>
            </div>
          )}

          {submissionState.message && !clientError && (
            <div
              className={`rounded-lg p-4 text-xs font-semibold flex items-start gap-2.5 border ${submissionState.success
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
                }`}
            >
              {submissionState.success ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              <span>{submissionState.message}</span>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex justify-center pt-4">
            <SubmitButton isUploading={activeUploadsCount > 0} isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
