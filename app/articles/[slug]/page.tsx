import { notFound } from "next/navigation";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { compile } from "@mdx-js/mdx";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

type Props = {
  params: { slug: string };
};

const prisma = new PrismaClient();

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug: slug },
  });

  if (!article) return notFound();

  const compiled = await compile(article.content, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight],
  });

  const { default: Content } = await run(compiled, { ...runtime });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Content />
      </div>
    </div>
  );
}
