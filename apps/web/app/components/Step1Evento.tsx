"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { usePQRSStore } from "../stores/pqrsStore";

const fieldClassName =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-ransa-500 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-400 shadow-sm text-sm";

const errorFieldClassName =
  "border-red-300 focus:ring-red-500 hover:border-red-400";

interface Step1FormData {
  eventDate: string;
  confirmDate: string;
  empresa: string;
  relacion: string;
  tipoSolicitud: string;
}

export function Step1Evento() {
  const formData = usePQRSStore((state) => state.formData);
  const updateFormData = usePQRSStore((state) => state.updateFormData);

  const {
    register,
    getValues,
    formState: { errors },
    watch,
  } = useForm<Step1FormData>({
    mode: "onChange",
    defaultValues: {
      eventDate: formData.eventDate,
      confirmDate: formData.confirmDate,
      empresa: formData.empresa,
      relacion: formData.relacion,
      tipoSolicitud: formData.tipoSolicitud,
    },
  });

  // Watch specific fields by name - watch() returns an object when given field names
  const eventDate = watch("eventDate");
  const confirmDate = watch("confirmDate");
  const empresa = watch("empresa");
  const relacion = watch("relacion");
  const tipoSolicitud = watch("tipoSolicitud");

  React.useEffect(() => {
    updateFormData({
      eventDate,
      confirmDate,
      empresa,
      relacion,
      tipoSolicitud,
    });
  }, [
    eventDate,
    confirmDate,
    empresa,
    relacion,
    tipoSolicitud,
    updateFormData,
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
        Paso 01 / 03 - Información General del Evento
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Fecha del evento <span className="text-ransa-accent">*</span>
          </label>
          <input
            type="date"
            {...register("eventDate", {
              required: "La fecha del evento es obligatoria.",
            })}
            className={`${fieldClassName} ${errors.eventDate ? errorFieldClassName : ""}`}
          />
          {errors.eventDate && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold">
              {errors.eventDate.message}
            </p>
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
                value === getValues("eventDate") ||
                "La confirmación de fecha no coincide con la fecha del evento.",
            })}
            className={`${fieldClassName} ${errors.confirmDate ? errorFieldClassName : ""}`}
          />
          {errors.confirmDate && (
            <p className="mt-1.5 text-xs text-red-500 font-semibold">
              {errors.confirmDate.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Empresa <span className="text-ransa-accent">*</span>
        </label>
        <select
          {...register("empresa", {
            required: "Debe seleccionar una empresa.",
          })}
          className={`${fieldClassName} ${errors.empresa ? errorFieldClassName : ""}`}
        >
          <option value="">Seleccione opción</option>
          <option value="Ransa Colombia S.A.S">1. Ransa Colombia S.A.S</option>
          <option value="Ransa Cargo S.A.S">2. Ransa Cargo S.A.S</option>
          <option value="Wcargo S.A.S">3. Wcargo S.A.S</option>
        </select>
        {errors.empresa && (
          <p className="mt-1.5 text-xs text-red-500 font-semibold">
            {errors.empresa.message}
          </p>
        )}
        <p className="mt-1.5 text-xs text-gray-500 italic">
          (Ransa Colombia es Almacenamiento y Laboratorio; Ransa Cargo es
          Transporte)
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Relación <span className="text-ransa-accent">*</span>
        </label>
        <select
          {...register("relacion", {
            required: "Debe seleccionar la relación.",
          })}
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
          <p className="mt-1.5 text-xs text-red-500 font-semibold">
            {errors.relacion.message}
          </p>
        )}
        <p className="mt-1.5 text-xs text-gray-500 italic">
          (¿Quién radica la solicitud?)
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Tipo de solicitud <span className="text-ransa-accent">*</span>
        </label>
        <select
          {...register("tipoSolicitud", {
            required: "Debe seleccionar el tipo de solicitud.",
          })}
          className={`${fieldClassName} ${errors.tipoSolicitud ? errorFieldClassName : ""}`}
        >
          <option value="">Seleccione opción</option>
          <option value="consulta">Consulta / Comercial - Técnica</option>
          <option value="facturacion">Novedad de Facturación</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="reconocimiento">Reconocimiento / Felicitación</option>
          <option value="sugerencias">
            Sugerencias / Oportunidad de Mejora
          </option>
        </select>
        {errors.tipoSolicitud && (
          <p className="mt-1.5 text-xs text-red-500 font-semibold">
            {errors.tipoSolicitud.message}
          </p>
        )}
      </div>
    </div>
  );
}
