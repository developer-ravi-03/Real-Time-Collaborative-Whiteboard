import { ZodError } from "zod";
import ApiResponse from "../utils/ApiResponse.js";

const validateRequest = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      req[source] = await schema.parseAsync(req[source]);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json(new ApiResponse(400, "Validation failed.", error.flatten()));
      }

      next(error);
    }
  };
};

export default validateRequest;
