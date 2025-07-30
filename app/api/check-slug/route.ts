import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ exists: false });
    }

    const exists = await prisma.article.findUnique({
        where: { slug },
    });

    return NextResponse.json({ exists: !!exists });
}
