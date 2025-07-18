// /app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import multer from 'multer';
import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: { bodyParser: false }, // disable default body parser for file upload
};

// Helper to convert route.ts into a handler-compatible file
const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(upload.single('cover'));

handler.post(async (req: any, res: any) => {
  const { title, slug, content } = req.body;
  const file = req.file;

  const imageUrl = file ? `/uploads/${file.filename}` : null;

  try {
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        // store relative image URL
        ...(imageUrl && { content: content.replace('{image}', `<Image src="${imageUrl}" width={600} height={400} />`) }),
      },
    });

    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

export default handler;
