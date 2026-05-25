import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <div className="text-7xl mb-4">🫥</div>
        <h1 className="text-4xl font-bold mb-2">Niet gevonden</h1>
        <p className="text-white/60 mb-6">Deze soundboard bestaat niet (of nog niet).</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/15 transition"
        >
          ← terug naar start
        </Link>
      </div>
    </main>
  );
}
