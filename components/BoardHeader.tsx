type Props = {
  name: string;
  emoji: string;
  clipCount: number;
  slug: string;
};

export function BoardHeader({ name, emoji, clipCount, slug }: Props) {
  return (
    <header className="pt-10 pb-6 px-6 text-center">
      <div className="text-6xl mb-2 inline-block animate-bounce">{emoji}</div>
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent leading-tight">
        {name}
      </h1>
      <div className="text-white/50 mt-2 text-sm">
        {clipCount} {clipCount === 1 ? 'sound' : 'sounds'} · /s/{slug}
      </div>
    </header>
  );
}
