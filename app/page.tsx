import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-xl">
        <div className="text-7xl mb-4 inline-block animate-bounce">🎵</div>
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent mb-4 leading-tight">
          SoundboardMe
        </h1>
        <p className="text-white/70 text-lg mb-10">
          Maak een soundboard van iemand.<br />
          Neem op, deel met één link, tap = afspelen.
        </p>
        <Link
          href="/new"
          className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-lg shadow-[0_15px_50px_-10px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition"
        >
          ➕ maak een soundboard
        </Link>
      </div>
    </main>
  );
}
