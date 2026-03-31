'use client'

import { useState } from 'react'

const styles = [
  { id: 'bold', name: 'Bold & Vibrant', desc: 'Eye-catching colors' },
  { id: 'minimal', name: 'Clean & Minimal', desc: 'Modern professional look' },
  { id: 'gaming', name: 'Gaming Epic', desc: 'Neon action style' },
  { id: 'vlog', name: 'Lifestyle Vlog', desc: 'Warm friendly style' },
  { id: 'tech', name: 'Tech Review', desc: 'Futuristic sleek' },
  { id: 'educational', name: 'Educational', desc: 'Clear informative' },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('bold')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your video')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setImageUrl(data.imageUrl)
    } catch {
      setError('Failed to generate thumbnail')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `thumbify-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Generate Your Thumbnail
        </h1>
        <p className="text-gray-400 text-center mb-10">
          Describe your video and pick a style. AI does the rest.
        </p>

        {/* Prompt Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe your video
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A person reacting to a shocking news headline, dramatic expression, red background"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none h-28"
          />
        </div>

        {/* Style Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Choose a style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  style === s.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-400">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl text-lg font-semibold transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Thumbnail'
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Result */}
        {imageUrl && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Thumbnail</h2>
            <div className="rounded-xl overflow-hidden border border-gray-700">
              <img
                src={imageUrl}
                alt="Generated thumbnail"
                className="w-full"
              />
            </div>
            <button
              onClick={handleDownload}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
            >
              Download HD Thumbnail
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
