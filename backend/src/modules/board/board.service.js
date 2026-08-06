import db from "../../lib/db.js";
import ApiError from "../../utils/ApiError.js";
import PageService from "./page.service.js";

class BoardService {
  /* -------------------------------------------------------------------------- */
  /*                         Default Board Settings                             */
  /* -------------------------------------------------------------------------- */

  getDefaultBoardSettings(type) {
    switch (type) {
      case "INFINITE":
        return {
          background: "#ffffff",
          grid: true,
          snapToGrid: false,
        };

      case "SLIDES":
        return {
          pageSize: "A4",
          background: "#ffffff",
        };

      default:
        throw new ApiError(400, "Invalid board type.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              Create Board                                  */
  /* -------------------------------------------------------------------------- */

  async createBoard(roomId, userId, boardData) {
    return await db.$transaction(async (tx) => {
      const existingBoard = await tx.board.findFirst({
        where: {
          roomId,
          name: boardData.name,
        },
      });

      if (existingBoard) {
        throw new ApiError(409, "Board with this name already exists.");
      }

      const board = await tx.board.create({
        data: {
          roomId,

          createdById: userId,

          name: boardData.name,

          description: boardData.description,

          type: boardData.type,

          settings: this.getDefaultBoardSettings(boardData.type),
        },
      });

      await tx.boardPage.create({
        data: {
          boardId: board.id,

          pageNumber: 1,

          title: null,

          canvasData: PageService.getDefaultCanvasData(),

          version: 1,
        },
      });

      return await tx.board.findUnique({
        where: {
          id: board.id,
        },

        include: {
          createdBy: {
            select: {
              id: true,
              displayName: true,
              imageUrl: true,
            },
          },

          _count: {
            select: {
              pages: true,
            },
          },
        },
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Get Room Boards                                  */
  /* -------------------------------------------------------------------------- */

  async getBoardsByRoom(roomId) {
    return await db.board.findMany({
      where: {
        roomId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        _count: {
          select: {
            pages: true,
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Get First Board                                  */
  /* -------------------------------------------------------------------------- */

  async getFirstBoard(roomId) {
    const board = await db.board.findFirst({
      where: {
        roomId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        _count: {
          select: {
            pages: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    if (!board) {
      throw new ApiError(404, "No board found.");
    }

    return board;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Get Board                                    */
  /* -------------------------------------------------------------------------- */

  async getBoard(boardId) {
    return await db.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        room: true,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Get Board                                 */
  /* -------------------------------------------------------------------------- */

  async getBoardDetails(boardId) {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        _count: {
          select: {
            pages: true,
          },
        },
      },
    });

    if (!board) {
      throw new ApiError(404, "Board not found.");
    }

    return board;
  }

  async getBoardInitialization(boardId) {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        pages: {
          orderBy: {
            pageNumber: "asc",
          },
        },

        _count: {
          select: {
            pages: true,
          },
        },
      },
    });

    if (!board) {
      throw new ApiError(404, "Board not found.");
    }

    return board;
  }
  /* -------------------------------------------------------------------------- */
  /*                              Update Board                                  */
  /* -------------------------------------------------------------------------- */

  async updateBoard(boardId, boardData) {
    const board = await this.getBoard(boardId);

    if (!board) {
      throw new ApiError(404, "Board not found.");
    }

    if (boardData.name && boardData.name !== board.name) {
      const duplicate = await db.board.findFirst({
        where: {
          roomId: board.roomId,
          name: boardData.name,
          NOT: {
            id: boardId,
          },
        },
      });

      if (duplicate) {
        throw new ApiError(409, "Board with this name already exists.");
      }
    }

    return await db.board.update({
      where: {
        id: boardId,
      },

      data: {
        ...(boardData.name !== undefined && {
          name: boardData.name,
        }),

        ...(boardData.description !== undefined && {
          description: boardData.description,
        }),
      },

      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },

        _count: {
          select: {
            pages: true,
          },
        },
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Delete Board                                  */
  /* -------------------------------------------------------------------------- */

  async deleteBoard(boardId) {
    const board = await this.getBoard(boardId);

    if (!board) {
      throw new ApiError(404, "Board not found.");
    }

    await db.board.delete({
      where: {
        id: board.id,
      },
    });

    return board;
  }
}

export default new BoardService();
