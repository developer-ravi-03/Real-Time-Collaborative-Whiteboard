export function ensureJoinedRoom(socket, callback) {
  if (!socket.currentRoomId) {
    callback({
      success: false,
      message: "Join a room first.",
    });

    return false;
  }

  return true;
}

export function ensureSameRoom(socket, roomId, callback) {
  if (socket.currentRoomId !== roomId) {
    callback({
      success: false,
      message: "Access denied.",
    });

    return false;
  }

  return true;
}

export function ensureRoomOwner(socket, room, callback) {
  if (room.ownerId !== socket.user.id) {
    callback({
      success: false,
      message: "Only owner can perform this action.",
    });

    return false;
  }

  return true;
}
