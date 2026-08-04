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
}

export default new RoomMemberService();
