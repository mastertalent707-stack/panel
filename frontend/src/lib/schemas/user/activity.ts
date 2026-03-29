import { z } from 'zod';
import { activitySchema } from '@/lib/schemas/activity.ts';

export const userActivitySchema = z.lazy(() =>
  activitySchema.omit({
    user: true,
  }),
);
