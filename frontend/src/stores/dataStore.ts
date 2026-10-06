import { create } from "zustand";
import { api } from "@/lib/api";
export type Doctor = {
    _id?: string;
    id?: string;
    name: string;
    phone?: string;
    specialization?: string;
    active?: boolean;
    email?: string;
};
export type Patient = {
    _id?: string;
    id?: string;
    name: string;
    phone: string;
    email?: string;
};
export type Appointment = {
    _id?: string;
    id?: string;
    patient?: Patient;
    patientId?: Patient | string;
    doctor?: Doctor;
    doctorId?: Doctor | string;
    date: string;
    time: string;
    status: string;
    purpose?: string;
};
type State = {
    doctors: Doctor[];
    patients: Patient[];
    appointments: Appointment[];
    loading: boolean;
    loadAll: () => Promise<void>;
    createDoctor: (data: Partial<Doctor>) => Promise<void>;
    updateDoctor: (id: string, data: Partial<Doctor>) => Promise<void>;
    createAppointment: (data: Record<string, unknown>) => Promise<void>;
    updateAppointment: (id: string, data: Record<string, unknown>) => Promise<void>;
};
export const useDataStore = create<State>((set, get) => ({
    doctors: [],
    patients: [],
    appointments: [],
    loading: false,
    async loadAll() {
        set({ loading: true });
        try {
            const [doctorResponse, patientResponse, appointmentResponse] = await Promise.all([
                api<{
                    doctors: Doctor[];
                }>("/doctors"),
                api<{
                    patients: Patient[];
                }>("/patients"),
                api<{
                    appointments: Appointment[];
                }>("/appointments"),
            ]);
            set({
                doctors: doctorResponse.doctors ?? [],
                patients: patientResponse.patients ?? [],
                appointments: appointmentResponse.appointments ?? [],
            });
        }
        finally {
            set({ loading: false });
        }
    },
    async createDoctor(data) {
        const response = await api<{
            doctor: Doctor;
        }>("/doctors", {
            method: "POST",
            body: JSON.stringify(data),
        });
        set({ doctors: [response.doctor, ...get().doctors] });
    },
    async updateDoctor(id, data) {
        const response = await api<{
            doctor: Doctor;
        }>(`/doctors/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        set({
            doctors: get().doctors.map((doctor) => doctor.id === id || doctor._id === id ? response.doctor : doctor),
        });
    },
    async createAppointment(data) {
        await api<{
            appointment: Appointment;
        }>("/appointments", {
            method: "POST",
            body: JSON.stringify(data),
        });
        // The create endpoint returns unpopulated IDs; reload to get patient/doctor details.
        await get().loadAll();
    },
    async updateAppointment(id, data) {
        await api<{
            appointment: Appointment;
        }>(`/appointments/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        // The update endpoint also returns an unpopulated appointment document.
        await get().loadAll();
    },
}));

