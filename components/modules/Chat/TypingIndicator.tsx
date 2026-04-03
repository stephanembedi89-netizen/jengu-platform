export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-navy-card rounded-2xl rounded-tl-none w-fit border border-navy-border" role="status" aria-label="FiscoAI est en train d'écrire">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-glow"
          style={{
            animation: `typing 1.2s infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
