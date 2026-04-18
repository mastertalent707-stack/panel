import { z } from 'zod';
import { axiosInstance } from '@/api/axios.ts';
import { serverScheduleSchema } from '@/lib/schemas/server/schedules.ts';

export default async (uuid: string, data: object): Promise<z.infer<typeof serverScheduleSchema>> => {
  const { data } = await axiosInstance.post(`/api/client/servers/${uuid}/schedules/import`, data);
  return data.schedule;
};
