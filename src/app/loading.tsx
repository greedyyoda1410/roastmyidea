export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">⚡</div>
        <h2 className="text-2xl font-bold text-accent mb-2 font-mono">
          Loading RoastMyIdea.AI
        </h2>
        <p className="text-muted-foreground animate-pulse">
          Preparing the judges panel...
        </p>
      </div>
    </div>
  );
}
