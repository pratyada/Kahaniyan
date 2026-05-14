// Animated equalizer bars — shows when a radio station is playing.

export default function SoundBars() {
  return (
    <span className="inline-flex items-end gap-[2px]">
      <span className="block h-2 w-[2px] animate-[twinkle_1s_ease-in-out_infinite] bg-gold" />
      <span className="block h-3 w-[2px] animate-[twinkle_0.8s_ease-in-out_infinite] bg-gold" style={{ animationDelay: '0.15s' }} />
      <span className="block h-1.5 w-[2px] animate-[twinkle_1.2s_ease-in-out_infinite] bg-gold" style={{ animationDelay: '0.3s' }} />
    </span>
  );
}
