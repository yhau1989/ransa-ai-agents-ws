"use client";

import { getSupabaseBrowserClient } from "./supabaseBrowser";

export async function uploadPQRSFile(file: File, folder: string): Promise<string> {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET env var");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `pqrs/${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(`No se pudo subir ${file.name}: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
