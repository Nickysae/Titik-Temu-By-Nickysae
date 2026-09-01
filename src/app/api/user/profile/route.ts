import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { uploadToSupabaseStorage } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, city, avatarUrl } = await req.json();

    let publicAvatarUrl: string | null = avatarUrl;
    if (avatarUrl && avatarUrl.startsWith("data:")) {
      publicAvatarUrl = await uploadToSupabaseStorage(avatarUrl, "avatars");
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(city !== undefined && { city: city.trim() || null }),
        ...(avatarUrl !== undefined && { avatarUrl: publicAvatarUrl }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
