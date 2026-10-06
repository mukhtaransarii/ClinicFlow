import { create } from "zustand";
import { api } from "@/lib/api";
export type Clinic = {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    address?: string;
    email?: string;
};
type State = {
    clinic: Clinic | null;
    loading: boolean;
    load: () => Promise<void>;
    update: (data: Partial<Clinic>) => Promise<void>;
};
export const useClinicStore = create<State>((set) => ({
    clinic: null, loading: false,
    load: async () => { set({ loading: true }); try {
        const data = await api<{
            clinic: Clinic;
        }>("/clinics/me");
        set({ clinic: data.clinic });
    }
    finally {
        set({ loading: false });
    } },
    update: async (data) => { const result = await api<{
        clinic: Clinic;
    }>("/clinics/me", { method: "PATCH", body: JSON.stringify(data) }); set({ clinic: result.clinic }); },
}));

