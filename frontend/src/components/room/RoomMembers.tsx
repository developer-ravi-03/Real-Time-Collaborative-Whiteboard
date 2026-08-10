"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Shield,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";

import type { RoomMember, RoomRole } from "@/types/room";

type RoomMembersProps = {
  members: RoomMember[];
  memberCount: number;
  yourRole: RoomRole;

  onUpdateRole: (
    memberId: string,
    role: Exclude<RoomRole, "OWNER">,
  ) => Promise<void>;

  onRemoveMember: (memberId: string) => Promise<void>;

  actionLoading: boolean;
};

export function RoomMembers({
  members,
  memberCount,
  yourRole,
  onUpdateRole,
  onRemoveMember,
  actionLoading,
}: RoomMembersProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null);

  const canManageMembers = yourRole === "OWNER";

  const handleRoleChange = async (
    memberId: string,
    role: Exclude<RoomRole, "OWNER">,
  ) => {
    setOpenMenu(null);

    await onUpdateRole(memberId, role);
  };

  const handleRemove = async () => {
    if (!selectedMember) return;

    await onRemoveMember(selectedMember.memberId);

    setSelectedMember(null);
  };

  return (
    <>
      <aside className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <Users className="h-4 w-4" />
          </div>

          <h2 className="font-semibold">Members</h2>

          <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs">
            {memberCount}
          </span>
        </div>

        {/* Members */}
        <div className="max-h-[500px] overflow-y-auto p-3">
          <div className="space-y-1">
            {members.map((member) => {
              const isOwner = member.role === "OWNER";
              const isMenuOpen = openMenu === member.memberId;

              return (
                <div key={member.memberId}>
                  <div
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
                    {/* Avatar */}
                    {member.user.imageUrl ? (
                      <img
                        src={member.user.imageUrl}
                        alt={member.user.displayName}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {member.user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* User */}
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

                    {/* Role */}
                    <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase">
                      {member.role}
                    </span>

                    {/* Owner doesn't need actions */}
                    {canManageMembers && !isOwner && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(isMenuOpen ? null : member.memberId)
                        }
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-muted-foreground
                          transition
                          hover:bg-muted
                          hover:text-foreground
                        "
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Inline menu */}
                  {isMenuOpen && canManageMembers && !isOwner && (
                    <div className="mx-3 mb-2 rounded-xl border border-border bg-muted/30 p-2">
                      <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Change role
                      </p>

                      {(["ADMIN", "EDITOR", "VIEWER"] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          disabled={actionLoading}
                          onClick={() =>
                            handleRoleChange(member.memberId, role)
                          }
                          className="
                flex
                w-full
                items-center
                justify-between
                rounded-lg
                px-3
                py-2
                text-sm
                transition
                hover:bg-muted
                disabled:opacity-50
              "
                        >
                          <span>{role}</span>

                          {member.role === role && (
                            <span className="text-xs text-muted-foreground">
                              Current
                            </span>
                          )}
                        </button>
                      ))}

                      <div className="my-1 border-t border-border" />

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => {
                          setOpenMenu(null);
                          setSelectedMember(member);
                        }}
                        className="
              flex
              w-full
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              text-destructive
              transition
              hover:bg-destructive/10
              disabled:opacity-50
            "
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove member
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Remove Confirmation */}
      {selectedMember && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>

                <h3 className="text-lg font-semibold">Remove member?</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Remove{" "}
                  <span className="font-medium text-foreground">
                    {selectedMember.user.displayName}
                  </span>{" "}
                  from this room?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                disabled={actionLoading}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-muted-foreground
                  transition
                  hover:bg-muted
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              This member will immediately lose access to this room.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                disabled={actionLoading}
                className="
                  h-11
                  flex-1
                  rounded-xl
                  border
                  border-border
                  text-sm
                  font-medium
                  transition
                  hover:bg-muted
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={actionLoading}
                className="
                  h-11
                  flex-1
                  rounded-xl
                  bg-destructive
                  text-sm
                  font-semibold
                  text-destructive-foreground
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {actionLoading ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
