import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  let content = formData.get("content") as string;

  const files = formData.getAll("images") as File[];

  // Loop through each image
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueName = `${uuidv4()}_${file.name}`;
    const filePath = join(process.cwd(), "public/uploads", uniqueName);

    await writeFile(filePath, buffer);

    const originalFilename = file.name;
    const publicPath = `/uploads/${uniqueName}`;
    const regex = new RegExp(`\\]\\(${originalFilename}\\)`, "g");
    content = content.replace(regex, `](${publicPath})`);
  }

  await prisma.article.create({
    data: {
      title,
      slug,
      content,
    },
  });

  return NextResponse.json({ message: "Article uploaded successfully" });
}
