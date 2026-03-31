export default function DashboardPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-10">Manage your thumbnails and account.</p>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Plan</div>
            <div className="text-2xl font-bold text-purple-400">Free</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Generations Used</div>
            <div className="text-2xl font-bold">0 / 3</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-gray-400 text-sm mb-1">Resets</div>
            <div className="text-2xl font-bold">Next month</div>
          </div>
        </div>

        {/* Recent Thumbnails */}
        <h2 className="text-2xl font-bold mb-6">Recent Thumbnails</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
          <p className="text-lg mb-4">No thumbnails yet</p>
          <a
            href="/generate"
            className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl transition"
          >
            Create Your First Thumbnail
          </a>
        </div>
      </div>
    </div>
  )
}
