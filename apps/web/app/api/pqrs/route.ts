import { NextRequest, NextResponse } from "next/server";
import { processPQRS, PQRSSubmissionData } from "../../actions/submitPQRS";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authorization if API_ACCESS_KEY is set
    const apiKey = process.env.API_ACCESS_KEY;
    if (apiKey) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Missing or invalid Authorization header. Expected Bearer token.",
          },
          { status: 401 },
        );
      }
      const token = authHeader.substring(7);
      if (token !== apiKey) {
        return NextResponse.json(
          { success: false, message: "Unauthorized. Invalid access token." },
          { status: 401 },
        );
      }
    }

    // 2. Parse payload
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // 3. Assemble and map data
    const data: PQRSSubmissionData = {
      eventDate: body.eventDate || "",
      confirmDate: body.confirmDate || "",
      empresa: body.empresa || "",
      relacion: body.relacion || "",
      tipoSolicitud: body.tipoSolicitud || "",
      nombreCliente: body.nombreCliente || "",
      nitCc: body.nitCc || "",
      descripcion: body.descripcion || "",
      valorVenta: body.valorVenta || "",
      valorCosto: body.valorCosto || "",
      telefono: body.telefono || "",
      region: body.region || "",
      proceso: body.proceso || "",
      tipoServicio: body.tipoServicio || "",
      ciudades: body.ciudades || "",
      emails: Array.isArray(body.emails) ? body.emails : [],
      supportFileUrl: body.supportFileUrl || "",
      supportFile2Url: body.supportFile2Url || "",
      valueSheetFileUrl: body.valueSheetFileUrl || "",
      certificateFileUrl: body.certificateFileUrl || null,
      channel: body.channel || "api",
      transportProcess: body.transportProcess || null,
      whatsappExecutionId: body.whatsappExecutionId || null,
    };

    // 4. Run business logic and DB insertion
    const result = await processPQRS(data);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado en el servidor.",
      },
      { status: 500 },
    );
  }
}
