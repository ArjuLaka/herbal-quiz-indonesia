'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UploadArticlePage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('content', content)
    if (image) formData.append('image', image)

    const res = await fetch('/api/articles', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      router.push('/articles')
    } else {
      alert('Failed to upload article')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Upload Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            required
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block"
          />
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={200}
              className="mt-2 rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
