import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gzewffvqwvsoxvdakyzn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_DHguGupSYW-MLnxFGbRH0g_cNnTG7o7";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a Base64 dataURL or File to Supabase Storage bucket 'rindu-photos'
 * Returns the public URL string.
 */
export async function uploadToSupabaseStorage(
  base64DataUrl: string,
  folder = "rindu"
): Promise<string> {
  try {
    // If it's already a full HTTP URL, return as is
    if (base64DataUrl.startsWith("http://") || base64DataUrl.startsWith("https://")) {
      return base64DataUrl;
    }

    // Convert Base64 dataURL to Blob
    const base64Parts = base64DataUrl.split(",");
    if (base64Parts.length < 2) return base64DataUrl;

    const mimeMatch = base64Parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const byteCharacters = atob(base64Parts[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    const extension = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    // Upload to 'rindu-photos' bucket
    const { data, error } = await supabase.storage
      .from("rindu-photos")
      .upload(fileName, blob, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn("Supabase storage upload error, falling back to base64:", error.message);
      return base64DataUrl; // Safe fallback if bucket not yet created
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("rindu-photos")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Storage upload exception:", err);
    return base64DataUrl; // Safe fallback
  }
}
