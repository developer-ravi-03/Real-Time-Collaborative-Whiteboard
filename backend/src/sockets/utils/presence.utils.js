import roomPresence from "../state/presence.store.js";

export function addUser(roomId, socket) {
  if (!roomPresence.has(roomId)) {
    roomPresence.set(roomId, new Map());
  }

  roomPresence.get(roomId).set(socket.id, {
    userId: socket.user.id,
    displayName: socket.user.displayName,
    imageUrl: socket.user.imageUrl,
  });
}

export function removeUser(roomId, socketId) {
  const room = roomPresence.get(roomId);

  if (!room) return;

  room.delete(socketId);

  if (room.size === 0) {
    roomPresence.delete(roomId);
  }
}

export function getUsers(roomId) {
  if (!roomPresence.has(roomId)) {
    return [];
  }

  return [...roomPresence.get(roomId).values()];
}
