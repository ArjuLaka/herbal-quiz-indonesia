// /app/api/articles/route.ts
import type { NextRequest, NextFetchEvent } from 'next/server';
import { createEdgeRouter } from 'next-connect';
import multer from 'multer';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const upload = multer({ dest: 'public/uploads/' });

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

router.use((req, res, next) =>
  upload.single('cover')(req as any, res as any, next)
);

router.post(async (req: NextRequest) => {
  const form = await req.formData();
  const title = form.get('title')?.toString() || '';
  const slug = form.get('slug')?.toString() || '';
  const content = form.get('content')?.toString() || '';
  const file = form.get('cover') as unknown as File;

  let imageUrl = null;
  if (file && file.name) {
    // multer saved it
    imageUrl = `/uploads/${(file as any).filename}`;
  }

  const article = await prisma.article.create({
    data: { title, slug, content },
  });

  return NextResponse.json({ success: true, article });
});

export { router as GET, router as POST };
