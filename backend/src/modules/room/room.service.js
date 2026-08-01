import db from "../../lib/db.js";

class RoomService {
  /* -------------------------------------------------------------------------- */
  /*                           Generate Unique Slug                             */
  /* -------------------------------------------------------------------------- */

  async generateUniqueSlug(name) {
    const baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await db.room.findUnique({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  /* -------------------------------------------------------------------------- */
  /*                         Generate Unique Room Code                          */
  /* -------------------------------------------------------------------------- */

  async generateUniqueRoomCode(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    while (true) {
      let roomCode = "";

      for (let i = 0; i < length; i++) {
        roomCode += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }

      const exists = await db.room.findUnique({
        where: {
          roomCode,
        },
      });

      if (!exists) {
        return roomCode;
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              Create Room                                   */
  /* -------------------------------------------------------------------------- */

  async createRoom(userId, roomData) {
    const slug = await this.generateUniqueSlug(roomData.name);

    const roomCode = await this.generateUniqueRoomCode();

    return await db.$transaction(async (tx) => {
      // Create Room
      const room = await tx.room.create({
        data: {
          name: roomData.name,
          description: roomData.description,
          visibility: roomData.visibility,
          slug,
          roomCode,
          ownerId: userId,
        },
      });

      // Add Owner as Member
      await tx.roomMember.create({
        data: {
          roomId: room.id,
          userId,
          role: "OWNER",
        },
      });

      // Return complete room
      return await tx.room.findUnique({
        where: {
          id: room.id,
        },

        include: {
          owner: true,

          memberships: {
            include: {
              user: true,
            },
          },
        },
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Basic Room                                */
  /* -------------------------------------------------------------------------- */

  async getRoom(roomId) {
    return await db.room.findUnique({
      where: {
        id: roomId,
      },

      select: {
        id: true,
        ownerId: true,
        visibility: true,
        slug: true,
        roomCode: true,
      },
    });
  }

  /**
   * Get all rooms of logged-in user
   */
  async getMyRooms(userId) {
    return await db.room.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },

      select: {
        id: true,
        name: true,
        slug: true,
        roomCode: true,

        description: true,
        thumbnail: true,
        visibility: true,

        createdAt: true,
        updatedAt: true,

        owner: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        memberships: {
          where: {
            userId,
          },

          select: {
            role: true,
          },
        },

        _count: {
          select: {
            memberships: true,
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Get Room Details
   */
  async getRoomDetails(roomId) {
    return await db.room.findUnique({
      where: {
        id: roomId,
      },

      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        memberships: {
          select: {
            role: true,
            userId: true,

            user: {
              select: {
                id: true,
                displayName: true,
                imageUrl: true,
              },
            },
          },
        },

        _count: {
          select: {
            memberships: true,
          },
        },
      },
    });
  }

  /**
   * Get membership of a user in a room
   */
  async getMembership(roomId, userId) {
    return await db.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });
  }
}

export default new RoomService();
