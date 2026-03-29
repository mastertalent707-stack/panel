import { z } from 'zod';
import { StateCreator } from 'zustand';
import { getEmptyPaginationSet } from '@/api/axios.ts';
import { adminEggConfigurationSchema } from '@/lib/schemas/admin/eggConfigurations.ts';
import { AdminStore } from '@/stores/admin.tsx';

export interface EggConfigurationsSlice {
  eggConfigurations: Pagination<z.infer<typeof adminEggConfigurationSchema>>;

  setEggConfigurations: (eggConfigurations: Pagination<z.infer<typeof adminEggConfigurationSchema>>) => void;
  addEggConfiguration: (eggConfiguration: z.infer<typeof adminEggConfigurationSchema>) => void;
  removeEggConfiguration: (eggConfiguration: z.infer<typeof adminEggConfigurationSchema>) => void;
}

export const createEggConfigurationsSlice: StateCreator<AdminStore, [], [], EggConfigurationsSlice> = (
  set,
): EggConfigurationsSlice => ({
  eggConfigurations: getEmptyPaginationSet<z.infer<typeof adminEggConfigurationSchema>>(),
  setEggConfigurations: (value) => set((state) => ({ ...state, eggConfigurations: value })),
  addEggConfiguration: (eggConfiguration) =>
    set((state) => ({
      eggConfigurations: {
        ...state.eggConfigurations,
        data: [...state.eggConfigurations.data, eggConfiguration],
        total: state.eggConfigurations.total + 1,
      },
    })),
  removeEggConfiguration: (eggConfiguration) =>
    set((state) => ({
      eggConfigurations: {
        ...state.eggConfigurations,
        data: state.eggConfigurations.data.filter((n) => n.uuid !== eggConfiguration.uuid),
        total: state.eggConfigurations.total - 1,
      },
    })),
});
