export const listTag = (type) => ({ type, id: 'LIST' });
export const itemTag = (type, id) => ({ type, id });

/**
 * Standard list / getById / create / update / delete endpoints.
 * @param {import('@reduxjs/toolkit/query').EndpointBuilder} builder
 * @param {{ plural: string, singular: string, path: string, tag: string }} config
 */
export function crud(builder, { plural, singular, path, tag, transformResponse }) {
  const list = listTag(tag);
  const item = (id) => itemTag(tag, id);
  const responseTransform = transformResponse ? { transformResponse } : {};

  return {
    [`get${plural}`]: builder.query({
      query: (params) =>
        params && typeof params === 'object' && Object.keys(params).length
          ? { url: path, params }
          : path,
      providesTags: [list],
      ...responseTransform,
    }),
    [`get${singular}ById`]: builder.query({
      query: (id) => `${path}/${id}`,
      providesTags: (_r, _e, id) => [item(id)],
      ...responseTransform,
    }),
    [`create${singular}`]: builder.mutation({
      query: (body) => ({ url: path, method: 'POST', body }),
      invalidatesTags: [list],
      ...responseTransform,
    }),
    [`update${singular}`]: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${path}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [list, item(id)],
      ...responseTransform,
    }),
    [`delete${singular}`]: builder.mutation({
      query: (id) => ({ url: `${path}/${id}`, method: 'DELETE' }),
      invalidatesTags: [list],
      ...responseTransform,
    }),
  };
}
