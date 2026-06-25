import { StateCreator } from 'zustand';
import { ServerStore } from '@/stores/server.ts';

export interface TransferSlice {
  transferProgressArchive: number;
  transferProgressNetwork: number;
  transferProgressTotal: number;
  transferProgressFiles: number;

  setTransferProgress: (progressArchive: number, progressNetwork: number, total: number, files: number) => void;
}

export const createTransferSlice: StateCreator<ServerStore, [], [], TransferSlice> = (set): TransferSlice => ({
  transferProgressArchive: 0,
  transferProgressNetwork: 0,
  transferProgressTotal: 0,
  transferProgressFiles: 0,

  setTransferProgress: (progressArchive, progressNetwork, total, files) =>
    set((state) => ({
      ...state,
      transferProgressArchive: progressArchive,
      transferProgressNetwork: progressNetwork,
      transferProgressTotal: total,
      transferProgressFiles: files,
    })),
});
