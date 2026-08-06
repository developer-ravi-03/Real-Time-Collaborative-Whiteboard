export const roomDetailsPresenter = (room, currentUserId) => {
  return {
    id: room.id,

    name: room.name,

    slug: room.slug,

    roomCode: room.roomCode,

    description: room.description,

    thumbnail: room.thumbnail,

    visibility: room.visibility,

    isSessionActive: room.isSessionActive,

    owner: {
      id: room.owner.id,
      displayName: room.owner.displayName,
      imageUrl: room.owner.imageUrl,
    },

    yourRole: room.memberships.find(
      (membership) => membership.userId === currentUserId,
    )?.role,

    memberCount: room._count.memberships,

    members: room.memberships.map((membership) => ({
      memberId: membership.id,

      role: membership.role,

      joinedAt: membership.joinedAt,

      user: {
        id: membership.user.id,

        displayName: membership.user.displayName,

        username: membership.user.username,

        imageUrl: membership.user.imageUrl,
      },
    })),

    boards: room.boards.map((board) => ({
      id: board.id,

      name: board.name,

      description: board.description,

      type: board.type,

      settings: board.settings,

      pageCount: board._count.pages,

      createdBy: {
        id: board.createdBy.id,
        displayName: board.createdBy.displayName,
        imageUrl: board.createdBy.imageUrl,
      },

      createdAt: board.createdAt,

      updatedAt: board.updatedAt,
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

      isSessionActive: room.isSessionActive,
    },

    yourRole: role,
  };
};

export const roomMembersPresenter = (members) => {
  return members.map((member) => ({
    memberId: member.id,

    role: member.role,

    joinedAt: member.joinedAt,

    user: {
      id: member.user.id,

      displayName: member.user.displayName,

      username: member.user.username,

      imageUrl: member.user.imageUrl,
    },
  }));
};

export const updatedMemberPresenter = (member) => ({
  memberId: member.id,

  role: member.role,

  user: {
    id: member.user.id,

    displayName: member.user.displayName,

    imageUrl: member.user.imageUrl,
  },
});

export const removedMemberPresenter = (member) => ({
  id: member.id,

  role: member.role,

  user: {
    id: member.user.id,

    displayName: member.user.displayName,

    imageUrl: member.user.imageUrl,
  },
});
