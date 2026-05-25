import baseAPI from '../../utils/config/api.js';
import { crud } from '../helpers/crud.js';

const productionApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    ...crud(builder, {
      plural: 'ProductionPlans',
      singular: 'ProductionPlan',
      path: '/production/plans',
      tag: 'Production',
    }),
    ...crud(builder, {
      plural: 'ProductionCycles',
      singular: 'ProductionCycle',
      path: '/production/cycles',
      tag: 'Production',
    }),
    ...crud(builder, {
      plural: 'ProductionCosts',
      singular: 'ProductionCost',
      path: '/production/costs',
      tag: 'Production',
    }),
    ...crud(builder, {
      plural: 'FinishedGoods',
      singular: 'FinishedGood',
      path: '/production/finished-goods',
      tag: 'Production',
    }),
    ...crud(builder, {
      plural: 'MaterialConsumptions',
      singular: 'MaterialConsumption',
      path: '/production/material-consumption',
      tag: 'Production',
    }),
  }),
});

export const {
  useGetProductionPlansQuery,
  useGetProductionPlanByIdQuery,
  useCreateProductionPlanMutation,
  useUpdateProductionPlanMutation,
  useDeleteProductionPlanMutation,
  useGetProductionCyclesQuery,
  useGetProductionCycleByIdQuery,
  useCreateProductionCycleMutation,
  useUpdateProductionCycleMutation,
  useDeleteProductionCycleMutation,
  useGetProductionCostsQuery,
  useGetProductionCostByIdQuery,
  useCreateProductionCostMutation,
  useUpdateProductionCostMutation,
  useDeleteProductionCostMutation,
  useGetFinishedGoodsQuery,
  useGetFinishedGoodByIdQuery,
  useCreateFinishedGoodMutation,
  useUpdateFinishedGoodMutation,
  useDeleteFinishedGoodMutation,
  useGetMaterialConsumptionsQuery,
  useGetMaterialConsumptionByIdQuery,
  useCreateMaterialConsumptionMutation,
  useUpdateMaterialConsumptionMutation,
  useDeleteMaterialConsumptionMutation,
} = productionApi;

export default productionApi;
