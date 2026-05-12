"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface FormData {
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
  email: string;
  emails: string[];
  telefono: string;
  region: string;
  transportProcess: string;
  proceso: string;
  tipoServicio: string;
  ciudades: string;
  soporteFile: File | null;
  soporteFile2: File | null;
  certificadoFile: File | null;
  cuadroValorFile: File | null;
}

const fieldClassName =
  "w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-ransa-700";

const primaryButtonClassName =
  "rounded-lg bg-ransa-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-ransa-800 focus:outline-none focus:ring-2 focus:ring-ransa-700 focus:ring-offset-2";

const submitButtonClassName =
  "rounded-lg bg-gradient-to-r from-ransa-700 to-ransa-800 px-8 py-3 font-semibold text-white shadow-lg transition hover:from-ransa-800 hover:to-ransa-900 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ransa-700 focus:ring-offset-2";

const removeButtonClassName =
  "rounded-md px-3 py-1.5 text-sm font-semibold text-ransa-accent transition hover:bg-ransa-accent-light/30 hover:text-ransa-accent-dark focus:outline-none focus:ring-2 focus:ring-ransa-accent focus:ring-offset-2";

export default function PQRSForm() {
  const [formData, setFormData] = useState<FormData>({
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
    email: "",
    emails: [],
    telefono: "",
    region: "",
    transportProcess: "",
    proceso: "",
    tipoServicio: "",
    ciudades: "",
    soporteFile: null,
    soporteFile2: null,
    certificadoFile: null,
    cuadroValorFile: null,
  });

  const [emailInput, setEmailInput] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleAddEmail = () => {
    if (emailInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        emails: [...prev.emails, emailInput.trim()],
      }));
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí va la lógica de envío
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ransa-50 to-ransa-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header con Logo */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/ransa-logo.svg"
              alt="RANSA Logo"
              width={200}
              height={60}
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ransa-700 mb-2">
            PQRS - Ransa Colombia
          </h1>
          <p className="text-lg text-ransa-600 font-semibold">
            Peticiones, Quejas, Reconocimientos y Sugerencias
          </p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">
              Bienvenido a nuestro Sistema de PQRS.
            </span>
          </p>
          <p className="text-gray-600">
            Este es el primer paso para procesar tu solicitud, por favor ingresa
            los datos requeridos y nuestro equipo trabajará para brindarte una
            respuesta.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          {/* Fecha del Evento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del evento <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className={fieldClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirme la fecha <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="date"
                name="confirmDate"
                value={formData.confirmDate}
                onChange={handleInputChange}
                required
                className={fieldClassName}
              />
            </div>
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa <span className="text-ransa-accent">*</span>
            </label>
            <select
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
              required
              className={fieldClassName}
            >
              <option value="">Seleccione opción</option>
              <option value="1">1. Ransa Colombia S.A.S</option>
              <option value="2">2. Ransa Cargo S.A.S</option>
              <option value="3">3. Wcargo S.A.S</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              (Ransa Colombia es Almacenamiento y Laboratorio y Ransa Cargo es
              Transporte)
            </p>
          </div>

          {/* Relación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relación <span className="text-ransa-accent">*</span>
            </label>
            <select
              name="relacion"
              value={formData.relacion}
              onChange={handleInputChange}
              required
              className={fieldClassName}
            >
              <option value="">Seleccione opción</option>
              <option value="cliente">Cliente</option>
              <option value="procesos">Procesos Internos</option>
              <option value="proveedor">Proveedor/ Contratista</option>
              <option value="tercero">Tercero/Transportador/Conductor</option>
              <option value="visitante">Visitante</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              (¿Quién radica la solicitud?)
            </p>
          </div>

          {/* Tipo de Solicitud */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de solicitud <span className="text-ransa-accent">*</span>
            </label>
            <select
              name="tipoSolicitud"
              value={formData.tipoSolicitud}
              onChange={handleInputChange}
              required
              className={fieldClassName}
            >
              <option value="">Seleccione opción</option>
              <option value="consulta">Consulta / Comercial - Técnica</option>
              <option value="facturacion">Novedad de Facturación</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
              <option value="reconocimiento">
                Reconocimiento/Felicitación
              </option>
              <option value="sugerencias">
                Sugerencias/Oportunidad de Mejora
              </option>
            </select>
          </div>

          {/* Nombre Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Cliente/Proveedor/Tercero{" "}
              <span className="text-ransa-accent">*</span>
            </label>
            <input
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              required
              placeholder="Digitar en MAYUSCULA"
              className={fieldClassName}
            />
          </div>

          {/* NIT/CC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIT/CC <span className="text-ransa-accent">*</span>
            </label>
            <input
              type="text"
              name="nitCc"
              value={formData.nitCc}
              onChange={handleInputChange}
              required
              placeholder="El NIT Incluido Dígito de verificación"
              className={fieldClassName}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la PQRS{" "}
              <span className="text-ransa-accent">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Detalle la novedad presentada"
              className={`${fieldClassName} resize-vertical`}
            />
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor venta / Comercial{" "}
                <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="number"
                name="valorVenta"
                value={formData.valorVenta}
                onChange={handleInputChange}
                required
                step="0.01"
                className={fieldClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor costo / Producción{" "}
                <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="number"
                name="valorCosto"
                value={formData.valorCosto}
                onChange={handleInputChange}
                required
                step="0.01"
                className={fieldClassName}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail <span className="text-ransa-accent">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddEmail();
                  }
                }}
                placeholder="Digite el correo para recibir respuesta"
                className={`${fieldClassName} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className={primaryButtonClassName}
              >
                Agregar
              </button>
            </div>

            {formData.emails.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border border-ransa-200 bg-ransa-50 p-2"
                  >
                    <span className="text-sm text-gray-700">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className={removeButtonClassName}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono de Contacto <span className="text-ransa-accent">*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
              className={fieldClassName}
            />
          </div>

          {/* Región */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Región / Ciudad <span className="text-ransa-accent">*</span>
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              required
              className={fieldClassName}
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
          </div>

          {/* Procesos de Transporte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Procesos de Transporte
            </label>
            <select
              name="transportProcess"
              value={formData.transportProcess}
              onChange={handleInputChange}
              className={fieldClassName}
            >
              <option value="">Seleccione opción</option>
              <option value="no-aplica">NO APLICA A TRANSPORTE</option>
              <option value="nacional">
                TRANSPORTE NACIONAL: Corresponde a vehículos exclusivos.
              </option>
              <option value="consolidacion">
                CONSOLIDACIÓN: Corresponde a transporte Nacional por Kg (fuera
                de la ciudad).
              </option>
              <option value="local">
                TRANSPORTE LOCAL: Corresponde al transporte dentro de la misma
                ciudad
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              (Aplica cuando la novedad le pertenece a Ransa Cargo - Transporte)
            </p>
          </div>

          {/* Proceso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proceso <span className="text-ransa-accent">*</span>
            </label>
            <select
              name="proceso"
              value={formData.proceso}
              onChange={handleInputChange}
              required
              className={fieldClassName}
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
          </div>

          {/* Tipo de Servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de servicio <span className="text-ransa-accent">*</span>
            </label>
            <select
              name="tipoServicio"
              value={formData.tipoServicio}
              onChange={handleInputChange}
              required
              className={fieldClassName}
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
          </div>

          {/* Ciudades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad de Origen y Ciudad de Entrega{" "}
              <span className="text-ransa-accent">*</span>
            </label>
            <input
              type="text"
              name="ciudades"
              value={formData.ciudades}
              onChange={handleInputChange}
              required
              placeholder="Ej: Bogotá - Medellín"
              className={fieldClassName}
            />
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soporte de la novedad reportada{" "}
                <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="file"
                name="soporteFile"
                onChange={handleFileChange}
                required
                className={fieldClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soporte de la novedad reportada II{" "}
                <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="file"
                name="soporteFile2"
                onChange={handleFileChange}
                required
                className={fieldClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificado de revisor (Cuando el valor de la PQRS sea mayor
                $999.999)
              </label>
              <input
                type="file"
                name="certificadoFile"
                onChange={handleFileChange}
                className={fieldClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato cuadro valor costo diligenciado{" "}
                <span className="text-ransa-accent">*</span>
              </label>
              <input
                type="file"
                name="cuadroValorFile"
                onChange={handleFileChange}
                required
                className={fieldClassName}
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="border-l-4 border-ransa-700 bg-ransa-50 p-4 rounded">
            <p className="font-semibold text-ransa-800 mb-2">
              Aviso de Privacidad y Protección de datos personales:
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Informamos que en cumplimiento de la ley 1581 de 2012 &quot;Ley de
              Protección de Datos personales&quot; y con base en lo establecido
              en el artículo 10 del Decreto Reglamentario 1377 de 2013, el
              registro del presente formulario es soporte de autorización para
              el ingreso y tratamiento de los datos aquí suministrados. Consulte
              nuestra Política de Protección de Datos Personales.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className={submitButtonClassName}
            >
              Aceptar y Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
