import ApiResponse from "../utils/ApiResponse.js";

const notFoundHandler = (req, res) => {
  return res
    .status(404)
    .json(new ApiResponse(404, `Route ${req.originalUrl} not found`));
};

export default notFoundHandler;
