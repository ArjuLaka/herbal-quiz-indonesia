import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { marked } from "marked";

type Props = {
  params: { slug: string };
};

export default async function ArticlePage({ params }: Props) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) return notFound();

  const { title, content, createdAt } = article;

  // Replace {image} with actual image tag
  const html = marked.parse(
    content.replace(
      "{image}",
      `<img src="/uploads/${params.slug}.jpg" alt="Cover image" class="my-4 w-full rounded-md shadow-md" />`
    )
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Posted on {new Date(createdAt).toLocaleDateString()}
      </p>

      <article
        className="prose prose-blue prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
