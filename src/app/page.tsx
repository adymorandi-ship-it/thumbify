import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            Create{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Stunning
            </span>{' '}
            Thumbnails in Seconds
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            AI-powered thumbnail maker for YouTube creators. No design skills needed. 
            Generate eye-catching thumbnails that get more clicks.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl text-lg font-semibold transition transform hover:scale-105"
            >
              Create Free Thumbnail
            </Link>
            <Link
              href="/pricing"
              className="border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl text-lg transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Video</h3>
              <p className="text-gray-400">
                Tell our AI what your video is about. Be as creative as you want.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Pick a Style</h3>
              <p className="text-gray-400">
                Choose from bold, minimal, gaming, vlog, tech, and more styles.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Download & Upload</h3>
              <p className="text-gray-400">
                Get your HD thumbnail instantly. Ready for YouTube in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              3 Free
            </div>
            <p className="text-gray-400 mt-2">Thumbnails per month</p>
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              6
            </div>
            <p className="text-gray-400 mt-2">Unique styles</p>
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              HD
            </div>
            <p className="text-gray-400 mt-2">1280x720 quality</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Get More Views?</h2>
          <p className="text-gray-400 mb-8">
            Join creators who are already using Thumbify to make their thumbnails stand out.
          </p>
          <Link
            href="/generate"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl text-lg font-semibold transition inline-block"
          >
            Start Creating — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-gray-500">
          <span>© 2026 Thumbify. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-white transition">Pricing</a>
            <a href="/generate" className="hover:text-white transition">Generate</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
