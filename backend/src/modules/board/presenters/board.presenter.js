/* -------------------------------------------------------------------------- */
/*                              Board Details                                 */
/* -------------------------------------------------------------------------- */

export const boardDetailsPresenter = (board) => {
  return {
    id: board.id,

    name: board.name,

    description: board.description,

    type: board.type,

    settings: board.settings,

    roomId: board.roomId,

    createdBy: {
      id: board.createdBy.id,

      displayName: board.createdBy.displayName,

      imageUrl: board.createdBy.imageUrl,
    },

    pageCount: board._count.pages,

    createdAt: board.createdAt,

    updatedAt: board.updatedAt,
  };
};

/* -------------------------------------------------------------------------- */
/*                              Board List                                    */
/* -------------------------------------------------------------------------- */

export const boardListPresenter = (boards) => {
  return boards.map((board) => ({
    id: board.id,

    name: board.name,

    description: board.description,

    type: board.type,

    roomId: board.roomId,

    createdBy: {
      id: board.createdBy.id,

      displayName: board.createdBy.displayName,

      imageUrl: board.createdBy.imageUrl,
    },

    pageCount: board._count.pages,

    updatedAt: board.updatedAt,
  }));
};
