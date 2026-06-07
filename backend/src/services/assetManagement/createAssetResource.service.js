export const createAssetResourceService = (model) => ({
  list: (filters = {}) => model.findAll(filters),
  getById: (id) => model.findById(id),
  create: (data) => model.create(data),
  update: (id, data) => model.update(id, data),
  remove: (id) => model.remove(id),
  transition: (id, status, extra = {}) => model.transition(id, status, extra),
});
