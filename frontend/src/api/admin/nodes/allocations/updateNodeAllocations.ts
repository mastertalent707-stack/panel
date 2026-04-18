import { axiosInstance } from '@/api/axios.ts';

interface Data {
  ip?: string;
  ipAlias?: string | null;
}

export default async (nodeUuid: string, allocationUuids: string[], data: Data): Promise<{ updated: number }> => {
  const { data } = await axiosInstance.patch(`/api/admin/nodes/${nodeUuid}/allocations`, {
    uuids: allocationUuids,
    ip: data.ip,
    ip_alias: data.ipAlias,
  });
  return data;
};
