// src/components/room/RoomMembers.tsx

import { Users } from "lucide-react";

import type { RoomMember, RoomRole } from "@/types/room";

type RoomMembersProps = {
  members: RoomMember[];
  memberCount: number;
  yourRole: RoomRole;
};

export function RoomMembers({ members, memberCount }: RoomMembersProps) {
  return (
    <aside>
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />

            <h2 className="font-semibold">Members</h2>

            <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs">
              {memberCount}
            </span>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-3">
          <div className="space-y-1">
            {members.map((member, index) => (
              <div
                key={
                  member.memberId || `${member.user.id}-${member.role}-${index}`
                }
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  p-3
                  transition
                  hover:bg-muted/60
                "
              >
                {member.user.imageUrl ? (
                  <img
                    src={member.user.imageUrl}
                    alt={member.user.displayName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {member.user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.user.displayName}
                  </p>

                  {member.user.username && (
                    <p className="truncate text-xs text-muted-foreground">
                      @{member.user.username}
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
