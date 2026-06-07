const ok = (res, data = {}, message = "OK") => res.json({ success: true, message, data });
const created = (res, data = {}, message = "Created") => res.status(201).json({ success: true, message, data });

const handleError = (res, err, label) => {
  console.error(`Asset resource ${label} error:`, err);
  return res.status(err.statusCode || 500).json({ success: false, error: err.message || "Request failed" });
};

export const createAssetResourceController = (moduleName, service) => ({
  async list(req, res) {
    try {
      const items = await service.list(req.query);
      return ok(res, { [moduleName]: items, items });
    } catch (err) {
      return handleError(res, err, `${moduleName}.list`);
    }
  },

  async getById(req, res) {
    try {
      const item = await service.getById(req.params.id);
      if (!item) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, { item });
    } catch (err) {
      return handleError(res, err, `${moduleName}.getById`);
    }
  },

  async create(req, res) {
    try {
      const item = await service.create(req.body);
      return created(res, { item }, "Asset management record created");
    } catch (err) {
      return handleError(res, err, `${moduleName}.create`);
    }
  },

  async update(req, res) {
    try {
      const item = await service.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, { item }, "Asset management record updated");
    } catch (err) {
      return handleError(res, err, `${moduleName}.update`);
    }
  },

  async remove(req, res) {
    try {
      const deleted = await service.remove(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, {}, "Asset management record deleted");
    } catch (err) {
      return handleError(res, err, `${moduleName}.remove`);
    }
  },

  async transition(req, res) {
    try {
      const { status, ...extra } = req.body || {};
      if (!status) return res.status(400).json({ success: false, error: "status is required" });
      const item = await service.transition(req.params.id, status, extra);
      if (!item) return res.status(404).json({ success: false, error: "Record not found" });
      return ok(res, { item }, "Status updated");
    } catch (err) {
      return handleError(res, err, `${moduleName}.transition`);
    }
  },
});
