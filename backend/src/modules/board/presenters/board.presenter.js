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

/* -------------------------------------------------------------------------- */
/*                         Board Initialization                               */
/* -------------------------------------------------------------------------- */

export const boardInitializationPresenter = (board) => {
  const pages = [...board.pages].sort((a, b) => a.pageNumber - b.pageNumber);

  const currentPage = pages[0] || null;

  return {
    board: {
      id: board.id,

      roomId: board.roomId,

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
    },

    yourRole: board.yourRole,

    pages: pages.map((page) => ({
      id: page.id,

      pageNumber: page.pageNumber,

      title: page.title,

      version: page.version,

      thumbnailUrl: page.thumbnailUrl,

      updatedAt: page.updatedAt,
    })),

    currentPage: currentPage
      ? {
          id: currentPage.id,

          pageNumber: currentPage.pageNumber,

          title: currentPage.title,

          canvasData: currentPage.canvasData,

          version: currentPage.version,

          thumbnailUrl: currentPage.thumbnailUrl,

          createdAt: currentPage.createdAt,

          updatedAt: currentPage.updatedAt,
        }
      : null,
  };
};
