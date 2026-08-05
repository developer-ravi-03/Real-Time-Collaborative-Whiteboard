/* -------------------------------------------------------------------------- */
/*                              Page Details                                  */
/* -------------------------------------------------------------------------- */

export const pageDetailsPresenter = (page) => {
  return {
    id: page.id,

    boardId: page.boardId,

    pageNumber: page.pageNumber,

    title: page.title,

    canvasData: page.canvasData,

    version: page.version,

    thumbnailUrl: page.thumbnailUrl,

    createdAt: page.createdAt,

    updatedAt: page.updatedAt,
  };
};

/* -------------------------------------------------------------------------- */
/*                               Page List                                    */
/* -------------------------------------------------------------------------- */

export const pageListPresenter = (pages) => {
  return pages.map((page) => ({
    id: page.id,

    pageNumber: page.pageNumber,

    title: page.title,

    version: page.version,

    thumbnailUrl: page.thumbnailUrl,

    updatedAt: page.updatedAt,
  }));
};
