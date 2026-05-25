type Props = { editable: boolean };

export function EmptyState({ editable }: Props) {
  return (
    <div className="text-center py-20 px-6 text-white/50">
      <div className="text-6xl mb-4">🎙️</div>
      <p className="text-lg">
        {editable
          ? 'Nog geen sounds — tik op + om je eerste op te nemen'
          : 'Deze soundboard is nog leeg'}
      </p>
    </div>
  );
}
