import db from "../../lib/db.js";
import ApiError from "../../utils/ApiError.js";

class RoomMemberService {
  async joinRoom(roomCode, userId) {
    return await db.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: {
          roomCode,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          roomCode: true,
          visibility: true,
        },
      });

      if (!room) {
        throw new ApiError(404, "Room not found.");
      }

      const existingMembership = await tx.roomMember.findUnique({
        where: {
          roomId_userId: {
            roomId: room.id,
            userId,
          },
        },
      });

      if (existingMembership) {
        throw new ApiError(409, "You are already a member of this room.");
      }

      await tx.roomMember.create({
        data: {
          roomId: room.id,
          userId,
          role: "VIEWER",
        },
      });

      return {
        room,
        role: "VIEWER",
      };
    });
  }

  /**
   * Get all room members
   */
  async getRoomMembers(roomId) {
    return await db.roomMember.findMany({
      where: {
        roomId,
      },

      orderBy: [
        {
          role: "asc",
        },
        {
          joinedAt: "asc",
        },
      ],

      select: {
        id: true,

        role: true,

        joinedAt: true,

        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(roomId, memberId, currentUserId, newRole) {
    return await db.$transaction(async (tx) => {
      // Current User Membership
      const currentMembership = await tx.roomMember.findUnique({
        where: {
          roomId_userId: {
            roomId,
            userId: currentUserId,
          },
        },
      });

      if (!currentMembership) {
        throw new ApiError(403, "You are not a member of this room.");
      }

      if (currentMembership.role !== "OWNER") {
        throw new ApiError(403, "Only the room owner can update member roles.");
      }

      // Target Member
      const targetMembership = await tx.roomMember.findUnique({
        where: {
          id: memberId,
        },

        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              imageUrl: true,
            },
          },
        },
      });

      if (!targetMembership) {
        throw new ApiError(404, "Member not found.");
      }

      if (targetMembership.roomId !== roomId) {
        throw new ApiError(400, "Invalid member.");
      }

      if (targetMembership.role === "OWNER") {
        throw new ApiError(400, "Owner role cannot be changed.");
      }

      if (targetMembership.userId === currentUserId) {
        throw new ApiError(400, "You cannot change your own role.");
      }

      const updatedMembership = await tx.roomMember.update({
        where: {
          id: memberId,
        },

        data: {
          role: newRole,
        },

        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              imageUrl: true,
            },
          },
        },
      });

      return updatedMembership;
    });
  }
  /**
   * Internal helper
   */
  async removeMembership(tx, roomId, memberId) {
    const membership = await tx.roomMember.findUnique({
      where: {
        id: memberId,
      },

      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, "Member not found.");
    }

    if (membership.roomId !== roomId) {
      throw new ApiError(400, "Invalid member.");
    }

    if (membership.role === "OWNER") {
      throw new ApiError(400, "Room owner cannot be removed.");
    }

    await tx.roomMember.delete({
      where: {
        id: memberId,
      },
    });

    return membership;
  }

  /**
   * Remove member
   */
  async removeMember(roomId, memberId, currentUserId) {
    return await db.$transaction(async (tx) => {
      const currentMembership = await tx.roomMember.findUnique({
        where: {
          roomId_userId: {
            roomId,
            userId: currentUserId,
          },
        },
      });

      if (!currentMembership) {
        throw new ApiError(403, "You are not a member of this room.");
      }

      if (currentMembership.role !== "OWNER") {
        throw new ApiError(403, "Only room owner can remove members.");
      }

      return await this.removeMembership(tx, roomId, memberId);
    });
  }

  /**
   * Leave Room
   */
  async leaveRoom(roomId, userId) {
    return await db.$transaction(async (tx) => {
      const membership = await tx.roomMember.findUnique({
        where: {
          roomId_userId: {
            roomId,
            userId,
          },
        },

        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              imageUrl: true,
            },
          },
        },
      });

      if (!membership) {
        throw new ApiError(404, "You are not a member of this room.");
      }

      if (membership.role === "OWNER") {
        throw new ApiError(
          400,
          "Owner cannot leave the room. End the session instead.",
        );
      }

      await tx.roomMember.delete({
        where: {
          id: membership.id,
        },
      });

      return membership;
    });
  }
}

export default new RoomMemberService();
