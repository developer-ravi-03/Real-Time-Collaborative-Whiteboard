export function emitCanvasInitialization(socket, board, page) {
  socket.emit("canvas:init", {
    board: {
      id: board.id,
      name: board.name,
      type: board.type,
      settings: board.settings,
    },

    page: {
      id: page.id,
      pageNumber: page.pageNumber,
      title: page.title,
      version: page.version,
      canvasData: page.canvasData,
    },
  });
}
