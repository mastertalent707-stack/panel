import { z } from 'zod';
import { activitySchema } from '@/lib/schemas/activity.ts';

export const serverActivitySchema = z.lazy(() => activitySchema.extend({
  isSchedule: z.boolean(),
}));
