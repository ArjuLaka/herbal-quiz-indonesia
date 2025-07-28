import { PrismaClient } from '@/lib/generated/prisma/client';
import { notFound } from 'next/navigation';
import { marked } from 'marked';

type Props = {
  params: { slug: string }
};

const prisma = new PrismaClient();

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) return notFound();

  const html = marked.parse(article.content);

  return (
    <div className="prose prose-lg max-w-3xl mx-auto py-8">
      <h1>{article.title}</h1>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="rounded-xl shadow-md w-full my-4"
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
