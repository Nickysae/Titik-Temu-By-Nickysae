import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import crypto from "crypto";

// POST /api/pair/refresh - Refreshes token pair & extends expiry by 30 days
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.coupleId) {
      return NextResponse.json({ error: "Unauthorized / No couple found" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const pairId = body.pairId;

    const pair = pairId
      ? await prisma.rinduPair.findUnique({ where: { id: pairId } })
      : await prisma.rinduPair.findFirst({
          where: { coupleId: session.coupleId },
          orderBy: { createdAt: "desc" },
        });

    const newTokenA = crypto.randomBytes(4).toString("hex");
    const newTokenB = crypto.randomBytes(4).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    let updatedPair;
    if (pair) {
      updatedPair = await prisma.rinduPair.update({
        where: { id: pair.id },
        data: {
          tokenA: newTokenA,
          tokenB: newTokenB,
          receivedA: false,
          receivedB: false,
          status: "locked",
          expiresAt,
        },
      });
    } else {
      updatedPair = await prisma.rinduPair.create({
        data: {
          coupleId: session.coupleId,
          tokenA: newTokenA,
          tokenB: newTokenB,
          receivedA: false,
          receivedB: false,
          status: "locked",
          expiresAt,
        },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    return NextResponse.json({
      success: true,
      pair: updatedPair,
      urlA: `${baseUrl}/api/pair/unlock?token=${newTokenA}`,
      urlB: `${baseUrl}/api/pair/unlock?token=${newTokenB}`,
      expiresAt: updatedPair.expiresAt,
    });
  } catch (error) {
    console.error("Pair refresh error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
