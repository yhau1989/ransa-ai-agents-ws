"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { usePQRSStore } from "../stores/pqrsStore";

const fieldClassName =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-ransa-500 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-400 shadow-sm text-sm";

const errorFieldClassName =
  "border-red-300 focus:ring-red-500 hover:border-red-400";

const primaryButtonClassName =
  "rounded-full bg-ransa-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-ransa-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ransa-500 focus:ring-offset-2";

const emailInputClassName =
  "email-input-readable flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm caret-ransa-600 outline-none transition-all duration-200 hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-ransa-500";

interface Step2FormData {
  nombreCliente: string;
  nitCc: string;
  descripcion: string;
  valorVenta: string;
  valorCosto: string;
  telefono: string;
  region: string;
  ciudades: string;
  transportProcess: string;
  proceso: string;
  tipoServicio: string;
}

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
        Correo electrónico de contacto{" "}
        <span className="text-ransa-accent">*</span>
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
          className={emailInputClassName}
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
              <span className="text-xs font-semibold text-ransa-800">
                {email}
              </span>
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

export function Step2Solicitante() {
  const formData = usePQRSStore((state) => state.formData);
  const updateFormData = usePQRSStore((state) => state.updateFormData);
  const setEmails = usePQRSStore((state) => state.setEmails);

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<Step2FormData>({
    mode: "onChange",
    defaultValues: {
      nombreCliente: formData.nombreCliente,
      nitCc: formData.nitCc,
      descripcion: formData.descripcion,
      valorVenta: formData.valorVenta,
      valorCosto: formData.valorCosto,
      telefono: formData.telefono,
      region: formData.region,
      ciudades: formData.ciudades,
      transportProcess: formData.transportProcess,
      proceso: formData.proceso,
      tipoServicio: formData.tipoServicio,
    },
  });

  const nombreCliente = watch("nombreCliente");
  const nitCc = watch("nitCc");
  const descripcion = watch("descripcion");
  const valorVenta = watch("valorVenta");
  const valorCosto = watch("valorCosto");
  const telefono = watch("telefono");
  const region = watch("region");
  const ciudades = watch("ciudades");
  const transportProcess = watch("transportProcess");
  const proceso = watch("proceso");
  const tipoServicio = watch("tipoServicio");

  React.useEffect(() => {
    updateFormData({
      nombreCliente,
      nitCc,
      descripcion,
      valorVenta,
      valorCosto,
      telefono,
      region,
      ciudades,
      transportProcess,
      proceso,
      tipoServicio,
    });
  }, [
    nombreCliente,
    nitCc,
    descripcion,
    valorVenta,
    valorCosto,
    telefono,
    region,
    ciudades,
    transportProcess,
    proceso,
    tipoServicio,
    updateFormData,
  ]);

  const handleEmailsChange = (emails: string[]) => {
    setEmails(emails);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
        Paso 02 / 03 - Datos del Solicitante y la Novedad
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Nombre Cliente / Proveedor / Tercero{" "}
            <span className="text-ransa-accent">*</span>
          </label>
          <input
            type="text"
            {...register("nombreCliente", {
              required: "El nombre es obligatorio.",
            })}
            placeholder="Digitar en MAYÚSCULA"
            className={`${fieldClassName} ${errors.nombreCliente ? errorFieldClassName : ""} placeholder:text-gray-300`}
          />
          {errors.nombreCliente && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold">
              {errors.nombreCliente.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            NIT / CC <span className="text-ransa-accent">*</span>
          </label>
          <input
            type="text"
            {...register("nitCc", {
              required: "El NIT o número de identificación es obligatorio.",
            })}
            placeholder="Incluir dígito de verificación"
            className={`${fieldClassName} ${errors.nitCc ? errorFieldClassName : ""} placeholder:text-gray-300`}
          />
          {errors.nitCc && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold">
              {errors.nitCc.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Descripción de la PQRS <span className="text-ransa-accent">*</span>
        </label>
        <textarea
          {...register("descripcion", {
            required: "La descripción detallada es obligatoria.",
          })}
          rows={4}
          placeholder="Detalle de forma clara la novedad presentada"
          className={`${fieldClassName} ${errors.descripcion ? errorFieldClassName : ""} resize-none`}
        />
        {errors.descripcion && (
          <p className="mt-1.5 text-xs text-red-500 font-semibold">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Valor venta / Comercial <span className="text-ransa-accent">*</span>
          </label>
          <input
            type="number"
            {...register("valorVenta", {
              required: "El valor comercial es obligatorio.",
            })}
            step="0.01"
            className={`${fieldClassName} ${errors.valorVenta ? errorFieldClassName : ""}`}
          />
          {errors.valorVenta && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold">
              {errors.valorVenta.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Valor costo / Producción{" "}
            <span className="text-ransa-accent">*</span>
          </label>
          <input
            type="number"
            {...register("valorCosto", {
              required: "El valor de costo o producción es obligatorio.",
            })}
            step="0.01"
            className={`${fieldClassName} ${errors.valorCosto ? errorFieldClassName : ""}`}
          />
          {errors.valorCosto && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold">
              {errors.valorCosto.message}
            </p>
          )}
        </div>
      </div>

      <EmailSection emails={formData.emails} onChange={handleEmailsChange} />

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Teléfono de Contacto <span className="text-ransa-accent">*</span>
        </label>
        <input
          type="tel"
          {...register("telefono", {
            required: "El teléfono de contacto es obligatorio.",
          })}
          placeholder="Ej: 3001234567"
          className={`${fieldClassName} ${errors.telefono ? errorFieldClassName : ""}`}
        />
        {errors.telefono && (
          <p className="mt-1.5 text-xs text-red-500 font-semibold">
            {errors.telefono.message}
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          Ubicación y Procesos Internos
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Región / Ciudad <span className="text-ransa-accent">*</span>
            </label>
            <select
              {...register("region", {
                required: "Debe seleccionar una región o ciudad.",
              })}
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
              <p className="mt-1.5 text-xs text-red-500 font-semibold">
                {errors.region.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Ciudad Origen y Entrega{" "}
              <span className="text-ransa-accent">*</span>
            </label>
            <input
              type="text"
              {...register("ciudades", {
                required: "Las ciudades de origen y entrega son obligatorias.",
              })}
              placeholder="Ej: Bogotá - Medellín"
              className={`${fieldClassName} ${errors.ciudades ? errorFieldClassName : ""}`}
            />
            {errors.ciudades && (
              <p className="mt-1.5 text-xs text-red-500 font-semibold">
                {errors.ciudades.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Procesos de Transporte
          </label>
          <select {...register("transportProcess")} className={fieldClassName}>
            <option value="">Seleccione opción</option>
            <option value="no-aplica">NO APLICA A TRANSPORTE</option>
            <option value="nacional">
              TRANSPORTE NACIONAL: Corresponde a vehículos exclusivos.
            </option>
            <option value="consolidacion">
              CONSOLIDACIÓN: Corresponde a transporte Nacional por Kg (fuera de
              la ciudad).
            </option>
            <option value="local">
              TRANSPORTE LOCAL: Corresponde al transporte dentro de la misma
              ciudad
            </option>
          </select>
          <p className="mt-1.5 text-xs text-gray-500 italic">
            (Aplica cuando la novedad le pertenece a Ransa Cargo - Transporte)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Proceso <span className="text-ransa-accent">*</span>
            </label>
            <select
              {...register("proceso", {
                required: "Debe asignar un proceso responsable.",
              })}
              className={`${fieldClassName} ${errors.proceso ? errorFieldClassName : ""}`}
            >
              <option value="">Seleccione opción</option>
              <option value="aseguramiento">
                Aseguramiento Sistemas Gestión Integral
              </option>
              <option value="compras">Compras</option>
              <option value="direccion">Dirección Estratégica</option>
              <option value="facturacion">Facturación</option>
              <option value="admin">Gestion Admón. y Financiera</option>
              <option value="comercial">Gestión Comercial</option>
              <option value="humana">Gestión Humana</option>
              <option value="almacenamiento">
                Gestión Operaciones- Almacenamiento
              </option>
              <option value="consolidacion">
                Gestión Operaciones-Consolidación
              </option>
              <option value="local-transport">
                Gestión Operaciones-Transporte Local
              </option>
              <option value="nacional-transport">
                Gestión Operaciones-Transporte Nacional
              </option>
              <option value="laboratorio">Laboratorio</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="seguridad">Seguridad</option>
              <option value="sistemas">Sistemas Información</option>
            </select>
            {errors.proceso && (
              <p className="mt-1.5 text-xs text-red-500 font-semibold">
                {errors.proceso.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Tipo de servicio <span className="text-ransa-accent">*</span>
            </label>
            <select
              {...register("tipoServicio", {
                required: "Debe seleccionar el tipo de servicio.",
              })}
              className={`${fieldClassName} ${errors.tipoServicio ? errorFieldClassName : ""}`}
            >
              <option value="">Seleccione opción</option>
              <option value="almacenamiento">Almacenamiento</option>
              <option value="consolidacion-local">Consolidación Local</option>
              <option value="consolidacion-nacional">
                Consolidación Nacional
              </option>
              <option value="logistica">Logística Urbana</option>
              <option value="no-aplica">No aplica</option>
              <option value="otro">Otro</option>
              <option value="exclusivo">Transporte Exclusivo</option>
            </select>
            {errors.tipoServicio && (
              <p className="mt-1.5 text-xs text-red-500 font-semibold">
                {errors.tipoServicio.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
