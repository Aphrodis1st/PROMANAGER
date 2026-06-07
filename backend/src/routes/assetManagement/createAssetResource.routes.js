import express from "express";

export const createAssetResourceRouter = (controller) => {
  const router = express.Router();

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);
  router.post("/:id/status", controller.transition);

  return router;
};
