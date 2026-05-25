"use server";

import { getSupabaseAdmin } from "../lib/supabaseAdmin";

export type SubmissionState = {
  success: boolean;
  message: string;
};

export interface PQRSSubmissionData {
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
  proceso: string;
  tipoServicio: string;
  ciudades: string;
  emails: string[];
  supportFileUrl: string;
  supportFile2Url: string;
  valueSheetFileUrl: string;
  certificateFileUrl?: string | null;
  channel?: string | null;
  transportProcess?: string | null;
}

const REQUIRED_TEXT_FIELDS = [
  "eventDate",
  "confirmDate",
  "empresa",
  "relacion",
  "tipoSolicitud",
  "nombreCliente",
  "nitCc",
  "descripcion",
  "valorVenta",
  "valorCosto",
  "telefono",
  "region",
  "proceso",
  "tipoServicio",
  "ciudades",
] as const;

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function processPQRS(
  data: PQRSSubmissionData,
): Promise<SubmissionState> {
  try {
    // Validate required fields
    for (const field of REQUIRED_TEXT_FIELDS) {
      const val = data[field];
      if (!val || (typeof val === "string" && !val.trim())) {
        return {
          success: false,
          message: `El campo ${field} es obligatorio.`,
        };
      }
    }

    const eventDate = (data.eventDate || "").trim();
    const confirmDate = (data.confirmDate || "").trim();

    if (eventDate !== confirmDate) {
      return {
        success: false,
        message: "La confirmación de fecha no coincide con la fecha del evento.",
      };
    }

    const emails = data.emails || [];
    if (emails.length === 0) {
      return {
        success: false,
        message: "Debes agregar al menos un correo electrónico.",
      };
    }

    const supportFileUrl = (data.supportFileUrl || "").trim();
    const supportFile2Url = (data.supportFile2Url || "").trim();
    const valueSheetFileUrl = (data.valueSheetFileUrl || "").trim();
    const certificateFileUrl = (data.certificateFileUrl || "").trim() || null;

    if (!supportFileUrl || !supportFile2Url || !valueSheetFileUrl) {
      return {
        success: false,
        message:
          "Debes adjuntar los soportes obligatorios y el formato de cuadro de valor costo.",
      };
    }

    const supabase = getSupabaseAdmin();

    const payload = {
      event_date: eventDate,
      confirm_date: confirmDate,
      company_name: (data.empresa || "").trim(),
      relationship_type: (data.relacion || "").trim(),
      request_category: (data.tipoSolicitud || "").trim(),
      client_name: (data.nombreCliente || "").trim(),
      id_number: (data.nitCc || "").trim(),
      description: (data.descripcion || "").trim(),
      sale_amount: (data.valorVenta || "").trim(),
      cost_amount: (data.valorCosto || "").trim(),
      email: emails[0],
      emails,
      phone: (data.telefono || "").trim(),
      region: (data.region || "").trim(),
      transport_process: (data.transportProcess || "").trim(),
      process: (data.proceso || "").trim(),
      service_type: (data.tipoServicio || "").trim(),
      cities: (data.ciudades || "").trim(),
      channel: (data.channel || "").trim() || "web",
      support_file_url: supportFileUrl,
      support_file_2_url: supportFile2Url,
      certificate_file_url: certificateFileUrl,
      value_sheet_file_url: valueSheetFileUrl,
    };

    const { error } = await supabase.from("form_submissions").insert(payload);

    if (error) {
      return {
        success: false,
        message: `No se pudo guardar la solicitud: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Solicitud enviada correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al enviar la solicitud.",
    };
  }
}

export async function submitPQRS(
  _prevState: SubmissionState,
  formData: FormData,
): Promise<SubmissionState> {
  try {
    const emailsRaw = getStringField(formData, "emails");
    let emails: string[] = [];

    try {
      const parsed = JSON.parse(emailsRaw);
      emails = Array.isArray(parsed)
        ? parsed.filter(
            (item): item is string => typeof item === "string" && item.trim().length > 0,
          )
        : [];
    } catch {
      emails = [];
    }

    const data: PQRSSubmissionData = {
      eventDate: getStringField(formData, "eventDate"),
      confirmDate: getStringField(formData, "confirmDate"),
      empresa: getStringField(formData, "empresa"),
      relacion: getStringField(formData, "relacion"),
      tipoSolicitud: getStringField(formData, "tipoSolicitud"),
      nombreCliente: getStringField(formData, "nombreCliente"),
      nitCc: getStringField(formData, "nitCc"),
      descripcion: getStringField(formData, "descripcion"),
      valorVenta: getStringField(formData, "valorVenta"),
      valorCosto: getStringField(formData, "valorCosto"),
      telefono: getStringField(formData, "telefono"),
      region: getStringField(formData, "region"),
      proceso: getStringField(formData, "proceso"),
      tipoServicio: getStringField(formData, "tipoServicio"),
      ciudades: getStringField(formData, "ciudades"),
      emails,
      supportFileUrl: getStringField(formData, "supportFileUrl"),
      supportFile2Url: getStringField(formData, "supportFile2Url"),
      valueSheetFileUrl: getStringField(formData, "valueSheetFileUrl"),
      certificateFileUrl: getStringField(formData, "certificateFileUrl") || null,
      channel: getStringField(formData, "channel") || "web",
      transportProcess: getStringField(formData, "transportProcess") || null,
    };

    return await processPQRS(data);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al procesar el formulario.",
    };
  }
}
