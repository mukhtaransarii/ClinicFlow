import { create } from "zustand";
import { api } from "@/lib/api";
export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    clinicId: string;
    clinic?: {
        id: string;
        name: string;
        slug?: string;
    };
};
type State = {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: Record<string, string>) => Promise<void>;
    loadMe: () => Promise<void>;
    logout: () => Promise<void>;
};
export const useAuthStore = create<State>((set) => ({
    user: null,
    loading: false,
    initialized: false,
    async login(email, password) {
        set({ loading: true });
        try {
            const response = await api<{
                user: User;
            }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            set({ user: response.user });
        }
        finally {
            set({ loading: false });
        }
    },
    async signup(data) {
        set({ loading: true });
        try {
            const response = await api<{
                user: User;
            }>("/auth/signup", {
                method: "POST",
                body: JSON.stringify(data),
            });
            set({ user: response.user });
        }
        finally {
            set({ loading: false });
        }
    },
    async loadMe() {
        try {
            const response = await api<{
                user: User;
            }>("/auth/me");
            set({ user: response.user });
        }
        catch {
            set({ user: null });
        }
        finally {
            set({ initialized: true });
        }
    },
    async logout() {
        // The current backend exposes logout as GET /auth/logout.
        await api("/auth/logout");
        set({ user: null });
    },
}));

