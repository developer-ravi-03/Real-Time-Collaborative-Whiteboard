export const roomDetailsPresenter = (room, currentUserId) => {
  return {
    id: room.id,

    name: room.name,

    slug: room.slug,

    roomCode: room.roomCode,

    description: room.description,

    thumbnail: room.thumbnail,

    visibility: room.visibility,

    owner: room.owner,

    yourRole: room.memberships.find(
      (membership) => membership.userId === currentUserId,
    )?.role,

    memberCount: room._count.memberships,

    members: room.memberships.map((membership) => ({
      id: membership.user.id,

      displayName: membership.user.displayName,

      imageUrl: membership.user.imageUrl,

      role: membership.role,
    })),

    createdAt: room.createdAt,

    updatedAt: room.updatedAt,
  };
};

export const joinedRoomPresenter = (room, role) => {
  return {
    room: {
      id: room.id,

      name: room.name,

      slug: room.slug,

      roomCode: room.roomCode,

      visibility: room.visibility,
    },

    yourRole: role,
  };
};
