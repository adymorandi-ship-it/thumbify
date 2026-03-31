'use client'

import { useState } from 'react'

const styles = [
  { id: 'bold', name: 'Bold & Vibrant', desc: 'Culori intense, dramatic', emoji: '🔥' },
  { id: 'minimal', name: 'Clean & Minimal', desc: 'Modern, elegant, simplu', emoji: '✨' },
  { id: 'gaming', name: 'Gaming Epic', desc: 'Neon, acțiune, cyberpunk', emoji: '🎮' },
  { id: 'vlog', name: 'Lifestyle Vlog', desc: 'Cald, prietenos, natural', emoji: '🌞' },
  { id: 'tech', name: 'Tech Review', desc: 'Futurist, sleek, gadgeturi', emoji: '💻' },
  { id: 'educational', name: 'Educational', desc: 'Clar, informativ, profesionist', emoji: '📚' },
]

const suggestions = [
  'O persoană surprinsă de o veste mare, expresie șocată',
  'Un gaming setup cu RGB și monitoare multiple',
  'Un tech reviewer ținând un telefon nou',
  'O persoană care cântă la chitară într-un studio',
  'Un tutorial pas cu pas pe laptop',
  'O mașină sport pe un drum de munte',
  'Un influencer făcând un haul de produse',
  'Un programator la birou cu cod pe ecran',
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('bold')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [history, setHistory] = useState<string[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Descrie videoul tău mai întâi')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')
    setCountdown(45)

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
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
        setError(data.error || 'A apărut o eroare')
        setLoading(false)
        return
      }

      setImageUrl(data.imageUrl)
      setHistory(prev => [data.imageUrl, ...prev.slice(0, 4)])
    } catch {
      clearInterval(timer)
      setError('Nu am putut genera thumbnail-ul. Încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `thumbify-${style}-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Generează Thumbnail
        </h1>
        <p className="text-gray-400 text-center mb-10">
          Descrie videoul tău, alege un stil, și AI-ul creează thumbnail-ul perfect.
        </p>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descrie videoul tău
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ex: Un youtiker surprins de o cifră mare pe ecran, expresie șocată, fundal albastru"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none h-24"
          />
        </div>

        {/* Suggestions */}
        <div className="mb-8">
          <label className="block text-xs text-gray-500 mb-2">Sugestii rapide:</label>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full text-gray-300 transition"
              >
                {s.slice(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Alege un stil
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
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="font-medium">{s.name}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">{s.desc}</div>
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
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Se generează... {countdown > 0 && `${countdown}s`}
            </span>
          ) : (
            'Generează Thumbnail'
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 text-center">
            <div className="animate-pulse bg-gray-800 rounded-xl aspect-video max-w-2xl mx-auto flex items-center justify-center">
              <div className="text-gray-500">
                <svg className="animate-spin h-12 w-12 mx-auto mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>AI-ul lucrează la thumbnail-ul tău...</p>
                {countdown > 0 && (
                  <div className="mt-3">
                    <div className="w-48 h-2 bg-gray-700 rounded-full mx-auto">
                      <div 
                        className="h-2 bg-purple-600 rounded-full transition-all duration-1000"
                        style={{ width: `${((45 - countdown) / 45) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2">Rămas: {countdown}s</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {imageUrl && !loading && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Thumbnail-ul Tău</h2>
            <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
              <img
                src={imageUrl}
                alt="Thumbnail generat"
                className="w-full"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-4 rounded-xl text-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descarcă HD
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-4 rounded-xl text-lg font-semibold border border-gray-700 hover:border-gray-500 transition"
              >
                Generează din nou
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && !loading && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4 text-gray-400">Generate recent:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {history.slice(1).map((img, i) => (
                <div 
                  key={i}
                  className="rounded-lg overflow-hidden border border-gray-800 cursor-pointer hover:border-purple-500 transition"
                  onClick={() => setImageUrl(img)}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
