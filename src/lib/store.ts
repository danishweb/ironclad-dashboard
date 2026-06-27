import { create } from 'zustand';

interface OrgContextStore {
  selectedOrgId: string | null;
  setSelectedOrgId: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useOrgContextStore = create<OrgContextStore>((set) => ({
  selectedOrgId: null,
  setSelectedOrgId: (id) => set({ selectedOrgId: id }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
