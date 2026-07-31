import db from "../../lib/db.js";

class UserService {
  async getUserByClerkId(clerkId) {
    return await db.user.findUnique({
      where: {
        clerkId,
      },
    });
  }

  async getUserByEmail(email) {
    return await db.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(userData) {
    return await db.user.create({
      data: userData,
    });
  }

  async updateUser(clerkId, userData) {
    return await db.user.update({
      where: {
        clerkId,
      },
      data: userData,
    });
  }

  async deleteUser(clerkId) {
    return await db.user.delete({
      where: {
        clerkId,
      },
    });
  }

  async upsertUser(userData) {
    return await db.user.upsert({
      where: {
        clerkId: userData.clerkId,
      },
      update: userData,
      create: userData,
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(clerkId, profileData) {
    return await db.user.update({
      where: {
        clerkId,
      },
      data: profileData,
    });
  }

  /**
   * Search users
   */
  async searchUsers(query) {
    return await db.user.findMany({
      where: {
        isActive: true,
        OR: [
          {
            displayName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },

      select: {
        id: true,
        clerkId: true,
        displayName: true,
        username: true,
        email: true,
        imageUrl: true,
      },

      orderBy: {
        displayName: "asc",
      },

      take: 20,
    });
  }
}

export default new UserService();
