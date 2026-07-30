import {
  BrainCircuit,
  PenTool,
  Users,
  FolderKanban,
} from "lucide-react";

export const features = [
  {
    id: 1,
    title: "AI Whiteboard",
    description:
      "Create diagrams, mind maps and sticky notes with AI assistance. Turn ideas into structured workflows instantly.",

    points: [
      "Infinite Canvas",
      "AI Sticky Notes",
      "Smart Drawing",
      "Diagram Generator",
    ],

    icon: PenTool,
  },

  {
    id: 2,
    title: "Project Management",

    description:
      "Organize projects with Kanban boards, sprint planning and task tracking designed for modern development teams.",

    points: [
      "Kanban Boards",
      "Sprint Planning",
      "Task Assignment",
      "Progress Tracking",
    ],

    icon: FolderKanban,
  },

  {
    id: 3,
    title: "Real-Time Collaboration",

    description:
      "Work together with your team using live cursors, comments and synchronized editing across every workspace.",

    points: [
      "Live Collaboration",
      "Shared Workspace",
      "Comments",
      "Presence Indicators",
    ],

    icon: Users,
  },

  {
    id: 4,
    title: "AI Productivity",

    description:
      "Automate repetitive work using AI summaries, meeting notes, task suggestions and intelligent insights.",

    points: [
      "Meeting Summary",
      "AI Suggestions",
      "Task Automation",
      "Smart Reports",
    ],

    icon: BrainCircuit,
  },
];