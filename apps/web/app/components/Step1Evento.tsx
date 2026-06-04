"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { usePQRSStore } from "../stores/pqrsStore";

const fieldClassName =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-ransa-500 bg-white text-gray-700 placeholder-gray-400 hover:border-gray-400 shadow-sm text-sm";

const dateFieldClassName = `${fieldClassName} date-input-standardized pr-11`;

const errorFieldClassName =
  "border-red-300 focus:ring-red-500 hover:border-red-400";

interface Step1FormData {
  eventDate: string;
  confirmDate: string;
  empresa: string;
  relacion: string;
  tipoSolicitud: string;
}

type DateFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const monthFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-ransa-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3M4 11h16M6 5h12a2 2 0 0 1 2 2v13H4V7a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  function DateField({ className = "", onChange, onClick, ...props }, ref) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const fieldRef = React.useRef<HTMLDivElement | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
    const [viewDate, setViewDate] = React.useState(() => new Date());
    const [selectedValue, setSelectedValue] = React.useState(() =>
      String(props.value ?? props.defaultValue ?? ""),
    );

    const selectedDate = parseDateValue(selectedValue);
    const calendarDays = getCalendarDays(viewDate);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const openDatePicker = () => {
      if (inputRef.current?.value) {
        setSelectedValue(inputRef.current.value);
        setViewDate(parseDateValue(inputRef.current.value) ?? new Date());
      }

      setIsCalendarOpen(true);
    };

    const selectDate = (date: Date) => {
      const nextValue = formatDateValue(date);

      setSelectedValue(nextValue);

      if (inputRef.current) {
        inputRef.current.value = nextValue;
        onChange?.({
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>);
      }

      setIsCalendarOpen(false);
    };

    const changeMonth = (monthOffset: number) => {
      setViewDate(
        (currentDate) =>
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + monthOffset,
            1,
          ),
      );
    };

    React.useEffect(() => {
      setSelectedValue(inputRef.current?.value ?? "");
    }, []);

    React.useEffect(() => {
      if (!isCalendarOpen) return;

      const handlePointerDown = (event: PointerEvent) => {
        if (!fieldRef.current?.contains(event.target as Node)) {
          setIsCalendarOpen(false);
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }, [isCalendarOpen]);

    return (
      <div ref={fieldRef} className="relative">
        <input
          type="hidden"
          {...props}
          ref={setRefs}
        />
        <input
          type="text"
          inputMode="numeric"
          className={className}
          value={formatDisplayDate(selectedValue)}
          placeholder="dd/mm/aaaa"
          readOnly
          onClick={(event) => {
            onClick?.(event);
            openDatePicker();
          }}
        />
        <button
          type="button"
          aria-label="Abrir calendario"
          className="absolute inset-y-px right-px flex w-12 cursor-pointer items-center justify-center rounded-r-lg bg-white"
          onClick={openDatePicker}
        >
          <CalendarIcon />
        </button>
        {isCalendarOpen && (
          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Mes anterior"
                className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => changeMonth(-1)}
              >
                ‹
              </button>
              <p className="text-sm font-semibold capitalize text-gray-800">
                {monthFormatter.format(viewDate)}
              </p>
              <button
                type="button"
                aria-label="Mes siguiente"
                className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100"
                onClick={() => changeMonth(1)}
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
              {weekDays.map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                const isSelected =
                  selectedDate !== null &&
                  formatDateValue(day) === formatDateValue(selectedDate);

                return (
                  <button
                    key={formatDateValue(day)}
                    type="button"
                    className={`h-8 rounded-md text-sm transition-colors ${
                      isSelected
                        ? "bg-ransa-600 font-semibold text-white"
                        : isCurrentMonth
                          ? "text-gray-700 hover:bg-ransa-50"
                          : "text-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => selectDate(day)}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

function parseDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const [, year, month, day] = match;

  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
  const date = parseDateValue(value);

  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getCalendarDays(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const mondayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const firstCalendarDay = new Date(firstDayOfMonth);

  firstCalendarDay.setDate(firstDayOfMonth.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const calendarDate = new Date(firstCalendarDay);
    calendarDate.setDate(firstCalendarDay.getDate() + index);

    return calendarDate;
  });
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
          <DateField
            {...register("eventDate", {
              required: "La fecha del evento es obligatoria.",
            })}
            className={`${dateFieldClassName} ${errors.eventDate ? errorFieldClassName : ""}`}
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
          <DateField
            {...register("confirmDate", {
              required: "Debe confirmar la fecha del evento.",
              validate: (value) =>
                value === getValues("eventDate") ||
                "La confirmación de fecha no coincide con la fecha del evento.",
            })}
            className={`${dateFieldClassName} ${errors.confirmDate ? errorFieldClassName : ""}`}
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
