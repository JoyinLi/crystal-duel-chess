import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ paddingLeft: '64px', paddingRight: '16px', paddingTop: '64px', paddingBottom: '64px' }}>
      <div className="text-center space-y-8 max-w-md">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Not Chess
          </h1>
          <p className="text-gray-400 text-lg">Private Chess for Two</p>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed">
          A refined chess experience for two players. Share your link and play in real time.
        </p>

        <div className="space-y-3 pt-4">
          <Link
            href="/room/crystal-duel?side=white"
            className="block px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-200 active:scale-95"
          >
            Play as Pink
          </Link>
          <Link
            href="/room/crystal-duel?side=black"
            className="block px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 active:scale-95"
          >
            Play as Blue
          </Link>
        </div>

        <div className="pt-4 text-xs text-gray-500 space-y-1">
          <p>Share the link with your opponent</p>
          <p>Both players can join from different devices</p>
        </div>
      </div>
    </main>
  );
}
