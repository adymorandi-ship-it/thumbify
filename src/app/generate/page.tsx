'use client'

import { useState } from 'react'

const styles = [
  { id: 'bold', name: 'Bold & Vibrant', desc: 'Culori intense, dramatic', emoji: '🔥' },
  { id: 'minimal', name: 'Clean & Minimal', desc: 'Modern, elegant', emoji: '✨' },
  { id: 'gaming', name: 'Gaming Epic', desc: 'Neon, acțiune', emoji: '🎮' },
  { id: 'vlog', name: 'Lifestyle Vlog', desc: 'Cald, natural', emoji: '🌞' },
  { id: 'tech', name: 'Tech Review', desc: 'Futurist, sleek', emoji: '💻' },
  { id: 'educational', name: 'Educational', desc: 'Clar, profesionist', emoji: '📚' },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('bold')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Scrie o descriere')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')
    setCountdown(60)

    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      })

      const data = await res.json()
      clearInterval(timer)

      if (!res.ok) {
        setError(data.error || 'Eroare')
        setLoading(false)
        return
      }

      setImageUrl(data.imageUrl)
    } catch {
      clearInterval(timer)
      setError('Nu am putut genera. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `thumbify-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Generează Thumbnail</h1>
        <p className="text-gray-400 text-center mb-10">Scrii descrierea, alegi stilul, primești thumbnail-ul.</p>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">Descriere</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descrie ce vrei să apară în thumbnail..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none h-24"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">Stil</label>
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
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="font-medium">{s.name}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl text-lg font-semibold transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Se generează... {countdown}s
            </span>
          ) : 'Generează Thumbnail'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 text-center">{error}</div>
        )}

        {loading && (
          <div className="mt-10 text-center">
            <div className="animate-pulse bg-gray-800 rounded-xl aspect-video max-w-2xl mx-auto flex items-center justify-center">
              <div className="text-gray-500">
                <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>AI-ul lucrează...</p>
                {countdown > 0 && <p className="text-sm mt-2">Rămas: {countdown}s</p>}
              </div>
            </div>
          </div>
        )}

        {imageUrl && !loading && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Thumbnail-ul Tău</h2>
            <div className="rounded-xl overflow-hidden border border-gray-700">
              <img src={imageUrl} alt="Thumbnail" className="w-full" />
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-4 rounded-xl text-lg font-semibold transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descarcă HD
              </button>
              <button onClick={handleGenerate} className="px-6 py-4 rounded-xl text-lg font-semibold border border-gray-700 hover:border-gray-500 transition">
                Generează din nou
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
