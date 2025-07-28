import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@/lib/generated/prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as File | null

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let imagePath: string | null = null

  if (image && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = `${uuidv4()}_${image.name}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filepath, buffer)
    imagePath = `/uploads/${filename}`
  }

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      image: imagePath,
    },
  })

  return NextResponse.json({ success: true, article })
}
