"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [slugIsValid, setSlugIsValid] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugExists, setSlugExists] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages((prev) => [...prev, ...fileArray]);
      setPreviews((prev) => [
        ...prev,
        ...fileArray.map((file) => ({ file, url: URL.createObjectURL(file) })),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newImages = [...images];
    const draggedImage = newImages[dragItem.current];
    newImages.splice(dragItem.current, 1);
    newImages.splice(dragOverItem.current, 0, draggedImage);
    setImages(newImages);

    const newPreviews = [...previews];
    const draggedPreview = newPreviews[dragItem.current];
    newPreviews.splice(dragItem.current, 1);
    newPreviews.splice(dragOverItem.current, 0, draggedPreview);
    setPreviews(newPreviews);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      const validFormat = slugPattern.test(slug);
      setSlugIsValid(validFormat);

      if (validFormat) {
        try {
          const res = await fetch(`/api/check-slug?slug=${slug}`);
          const data = await res.json();
          setSlugExists(data.exists);
        } catch (err) {
          console.error("Error checking slug:", err);
        }
      } else {
        setSlugExists(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));

    const res = await fetch("/api/articles", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/articles/${data.slug}`);
    } else {
      alert("Failed to upload article");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Upload Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={handleSlugChange}
            required
            className={`w-full p-2 border rounded-md ${
              slugIsValid && slugTouched ? "border-gray-300" : "border-red-500"
            }`}
          />
          {!slugIsValid && slugTouched && (
            <p className="text-sm text-red-600 mt-1">
              Slug must contain only lowercase letters, numbers, and hyphens. No
              spaces or special characters.
            </p>
          )}
          {slugTouched && slugIsValid && slugExists && (
            <p className="text-sm text-red-600 mt-1">
              This slug is already in use. Please choose another.
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block"
          />
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((preview, i) => (
                <div
                  key={i}
                  className="relative group border rounded p-2"
                  draggable
                  onDragStart={() => (dragItem.current = i)}
                  onDragEnter={() => (dragOverItem.current = i)}
                  onDragEnd={handleSort}
                >
                  <Image
                    src={preview.url}
                    alt={`Preview ${i + 1}`}
                    width={150}
                    height={100}
                    className="rounded-md w-full h-auto"
                  />
                  <p className="text-sm mt-1 text-center truncate">
                    {preview.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!slugIsValid || slugExists}
          className={`px-6 py-2 rounded-md transition text-white ${
            !slugIsValid || slugExists
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
