export default function HeroContent() {
  return (
    <div className="mt-8 flex max-w-4xl flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
        Build Together.
        <br />
        <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
          Ship Faster.
        </span>
        <br />
        Powered by AI.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
        SyncBoard helps modern teams collaborate in real time with AI-powered
        whiteboards, project management, tasks, and seamless teamwork—all in one
        workspace.
      </p>
    </div>
  );
}
