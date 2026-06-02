import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const formSubmissions = pgTable("form_submissions", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),

  eventDate: text("event_date").notNull(),
  confirmDate: text("confirm_date").notNull(),
  companyName: text("company_name").notNull(),
  relationshipType: text("relationship_type").notNull(),
  requestCategory: text("request_category").notNull(),
  clientName: text("client_name").notNull(),
  idNumber: text("id_number").notNull(),
  description: text("description").notNull(),
  saleAmount: text("sale_amount").notNull(),
  costAmount: text("cost_amount").notNull(),
  email: text("email").notNull(),
  emails: json("emails").$type<string[]>().notNull(),
  phone: text("phone").notNull(),
  region: text("region").notNull(),
  transportProcess: text("transport_process").notNull(),
  process: text("process").notNull(),
  serviceType: text("service_type").notNull(),
  cities: text("cities").notNull(),
  channel: text("channel").notNull(),

  supportFileUrl: text("support_file_url"),
  supportFile2Url: text("support_file_2_url"),
  certificateFileUrl: text("certificate_file_url"),
  valueSheetFileUrl: text("value_sheet_file_url"),
  whatsappExecutionId: text("whatsapp_execution_id"),
  isoToolsCode: text("iso_tools_code"),
  isoToolsCodeDate: timestamp("iso_tools_code_date", {
    withTimezone: true,
  }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
