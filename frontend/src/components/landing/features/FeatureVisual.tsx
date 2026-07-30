import AIMock from "./visuals/AIMock";
import CollaborationMock from "./visuals/CollaborationMock";
import KanbanMock from "./visuals/KanbanMock";
import WhiteboardMock from "./visuals/WhiteboardMock";

type Props = {
  title: string;
};

export default function FeatureVisual({ title }: Props) {
  switch (title) {
    case "AI Whiteboard":
      return <WhiteboardMock />;

    case "Project Management":
      return <KanbanMock />;

    case "Real-Time Collaboration":
      return <CollaborationMock />;

    case "AI Productivity":
      return <AIMock />;

    default:
      return (
        <div className="flex h-[520px] items-center justify-center rounded-3xl border border-dashed border-border text-muted-foreground">
          Preview Coming Soon
        </div>
      );
  }
}
