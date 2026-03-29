import { z } from 'zod';
import { nullableString } from '@/lib/transformers.ts';
import { eggConfigurationRouteItemSchema } from '../generic.ts';

export const adminEggConfigurationSchema = z.object({
  uuid: z.string(),
  name: z.string().min(3).max(255),
  description: z.preprocess(nullableString, z.string().max(1024).nullable()),
  order: z.number().min(0),
  eggs: z.uuid().array(),
  configAllocations: z
    .object({
      userSelfAssign: z.object({
        enabled: z.boolean(),
        requirePrimaryAllocation: z.boolean(),
        startPort: z.number().min(1024).max(65535),
        endPort: z.number().min(1024).max(65535),
      }),
    })
    .nullable(),
  configRoutes: z
    .object({
      order: z.array(eggConfigurationRouteItemSchema),
    })
    .nullable(),
  created: z.date(),
});

export const adminEggConfigurationUpdateSchema = z.lazy(() =>
  adminEggConfigurationSchema.omit({
    uuid: true,
    created: true,
  }),
);
