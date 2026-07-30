import AvatarStack from "./AvatarStack";
import CommentBubble from "./CommentBubble";
import CursorTag from "./CursorTag";
import StickyNote from "./StickyNote";

export default function CollaborationMock() {
  return (
    <div className="relative h-[540px] overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl">
      {/* Glow */}
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-violet-500/10 blur-[120px]" />

      {/* Grid */}
      <div
        className="
          absolute inset-0
          opacity-25
          bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      <AvatarStack />

      {/* Sticky Notes */}

      <StickyNote
        title="Landing Page"
        className="left-14 top-24 bg-yellow-400 text-black"
      />

      <StickyNote
        title="Authentication"
        className="left-48 top-72 bg-green-400 text-black"
      />

      <StickyNote
        title="Dashboard"
        className="left-72 top-170 bg-pink-400 text-black"
      />

      <StickyNote
        title="AI Ideas"
        className="right-14 top-20 bg-cyan-400 text-black"
      />

      {/* Connection Lines */}

      <div className="absolute left-[205px] top-[120px] h-[2px] w-[230px] bg-white/70" />

      <div className="absolute left-[320px] top-[120px] h-[180px] w-[2px] bg-white/70" />

      <div className="absolute left-[320px] top-[300px] h-[2px] w-[70px] bg-white/70" />

      <div className="absolute left-[390px] top-[300px] h-[100px] w-[2px] bg-white/70" />

      {/* Live Cursors */}

      <CursorTag name="Ravi" className="left-[280px] top-[180px]" />

      <CursorTag
        name="Priya"
        className="right-[160px] top-[160px] bg-violet-500"
      />

      {/* Comment */}

      <CommentBubble
        text="Let's move this section."
        className="bottom-28 right-32"
      />

      {/* Editing Status */}

      <div className="absolute bottom-10 right-8 flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
        Ravi editing...
      </div>
    </div>
  );
}
