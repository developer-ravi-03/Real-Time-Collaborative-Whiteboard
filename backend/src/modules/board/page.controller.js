import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

import PageService from "./page.service.js";

import {
  pageDetailsPresenter,
  pageListPresenter,
} from "./presenters/page.presenter.js";

/* -------------------------------------------------------------------------- */
/*                               Create Page                                  */
/* -------------------------------------------------------------------------- */

export const createPage = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const page = await PageService.createPage(boardId);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Page created successfully.",
        pageDetailsPresenter(page),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                               Get Pages                                    */
/* -------------------------------------------------------------------------- */

export const getPages = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  const pages = await PageService.getPages(boardId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Pages fetched successfully.",
        pageListPresenter(pages),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                             Get Page By Id                                 */
/* -------------------------------------------------------------------------- */

export const getPageById = asyncHandler(async (req, res) => {
  // const { pageId } = req.params;

  // const page = await PageService.getPageById(pageId);
  const page = await PageService.getPageDetails(req.page.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Page fetched successfully.",
        pageDetailsPresenter(page),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                              Update Page                                   */
/* -------------------------------------------------------------------------- */

export const updatePage = asyncHandler(async (req, res) => {
  // const { pageId } = req.params;

  // const page = await PageService.updatePage(pageId, req.body);
  const page = await PageService.updatePage(req.page.id, req.body);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Page updated successfully.",
        pageDetailsPresenter(page),
      ),
    );
});

/* -------------------------------------------------------------------------- */
/*                              Delete Page                                   */
/* -------------------------------------------------------------------------- */

export const deletePage = asyncHandler(async (req, res) => {
  await PageService.deletePage(req.page.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Page deleted successfully.", null));
});
