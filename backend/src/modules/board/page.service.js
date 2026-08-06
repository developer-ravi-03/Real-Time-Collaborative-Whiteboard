import db from "../../lib/db.js";
import ApiError from "../../utils/ApiError.js";

class PageService {
  /* -------------------------------------------------------------------------- */
  /*                          Default Canvas Data                               */
  /* -------------------------------------------------------------------------- */

  getDefaultCanvasData() {
    return {
      version: "6.0.0",
      objects: [],
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                               Create Page                                  */
  /* -------------------------------------------------------------------------- */

  async createPage(boardId) {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      throw new ApiError(404, "Board not found.");
    }

    if (board.type === "INFINITE") {
      throw new ApiError(400, "Infinite boards cannot have multiple pages.");
    }

    const lastPage = await db.boardPage.findFirst({
      where: {
        boardId,
      },

      orderBy: {
        pageNumber: "desc",
      },
    });

    const nextPageNumber = lastPage ? lastPage.pageNumber + 1 : 1;

    return await db.boardPage.create({
      data: {
        boardId,

        pageNumber: nextPageNumber,

        title: null,

        canvasData: this.getDefaultCanvasData(),

        version: 1,

        thumbnailUrl: null,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                Get Page                                    */
  /* -------------------------------------------------------------------------- */

  async getPage(pageId) {
    return await db.boardPage.findUnique({
      where: {
        id: pageId,
      },

      include: {
        board: {
          include: {
            room: true,
          },
        },
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Pages                                     */
  /* -------------------------------------------------------------------------- */

  async getPages(boardId) {
    return await db.boardPage.findMany({
      where: {
        boardId,
      },

      orderBy: {
        pageNumber: "asc",
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Get First Page                                   */
  /* -------------------------------------------------------------------------- */

  async getFirstPage(boardId) {
    const page = await db.boardPage.findFirst({
      where: {
        boardId,
      },

      orderBy: {
        pageNumber: "asc",
      },
    });

    if (!page) {
      throw new ApiError(404, "No page found.");
    }

    return page;
  }

  /* -------------------------------------------------------------------------- */
  /*                             Get Page By Id                                 */
  /* -------------------------------------------------------------------------- */

  async getPageDetails(pageId) {
    const page = await db.boardPage.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!page) {
      throw new ApiError(404, "Page not found.");
    }

    return page;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Update Page                                   */
  /* -------------------------------------------------------------------------- */

  async updatePage(pageId, pageData) {
    return await db.boardPage.update({
      where: {
        id: pageId,
      },

      data: {
        ...(pageData.title !== undefined && {
          title: pageData.title,
        }),
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Save Canvas                                   */
  /* -------------------------------------------------------------------------- */

  async saveCanvas(pageId, canvasData) {
    const page = await this.getPage(pageId);

    if (!page) {
      throw new ApiError(404, "Page not found.");
    }

    return await db.boardPage.update({
      where: {
        id: pageId,
      },

      data: {
        canvasData,

        version: {
          increment: 1,
        },
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Delete Page                                   */
  /* -------------------------------------------------------------------------- */

  async deletePage(pageId) {
    const page = await this.getPage(pageId);

    if (!page) {
      throw new ApiError(404, "Page not found.");
    }

    const totalPages = await db.boardPage.count({
      where: {
        boardId: page.boardId,
      },
    });

    if (totalPages <= 1) {
      throw new ApiError(400, "Cannot delete the last page of a board.");
    }

    return await db.$transaction(async (tx) => {
      await tx.boardPage.delete({
        where: {
          id: pageId,
        },
      });

      const remainingPages = await tx.boardPage.findMany({
        where: {
          boardId: page.boardId,
        },

        orderBy: {
          pageNumber: "asc",
        },
      });

      for (let index = 0; index < remainingPages.length; index++) {
        await tx.boardPage.update({
          where: {
            id: remainingPages[index].id,
          },

          data: {
            pageNumber: index + 1,
          },
        });
      }
      return page;
    });
  }
}

export default new PageService();
