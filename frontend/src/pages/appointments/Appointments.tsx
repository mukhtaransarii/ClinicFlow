import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useDataStore } from "@/stores/dataStore";
const filters = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "NO_SHOW",
    "CANCELLED",
];
type AppointmentForm = {
    doctorId: string;
    patientId: string;
    date: string;
    time: string;
    purpose: string;
};
const emptyForm: AppointmentForm = {
    doctorId: "",
    patientId: "",
    date: "",
    time: "",
    purpose: "",
};
export default function Appointments() {
    const { appointments, doctors, patients, loading, loadAll, createAppointment, updateAppointment, } = useDataStore();
    const [filter, setFilter] = useState("ALL");
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<AppointmentForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        void loadAll();
    }, [loadAll]);
    const activeDoctors = doctors.filter((doctor) => doctor.active !== false);
    const visibleAppointments = filter === "ALL"
        ? appointments
        : appointments.filter((appointment) => appointment.status === filter);
    function updateForm<K extends keyof AppointmentForm>(key: K, value: AppointmentForm[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }
    async function handleCreateAppointment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
            await createAppointment({ ...form });
            setModalOpen(false);
            setForm(emptyForm);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Could not create appointment.");
        }
        finally {
            setSaving(false);
        }
    }
    async function handleConfirm(id: string) {
        try {
            await updateAppointment(id, { status: "CONFIRMED" });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Could not confirm appointment.");
        }
    }
    return (<div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-zinc-500">Clinic schedule</p>
          <h1 className="text-2xl font-semibold">Appointments</h1>
        </div>
        <Button onClick={() => {
            setError("");
            setModalOpen(true);
        }}>
          New appointment
        </Button>
      </div>

      {error && (<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>)}

      <Card className="overflow-hidden">
        <div className="flex gap-2 overflow-x-auto border-b border-zinc-100 p-3">
          {filters.map((status) => (<Button key={status} size="sm" variant={filter === status ? "primary" : "ghost"} onClick={() => setFilter(status)}>
              {status.replace("_", " ")}
            </Button>))}
        </div>

        <div className="divide-y divide-zinc-100">
          {visibleAppointments.map((appointment, index) => {
            const id = appointment.id || appointment._id || String(index);
            const patient = appointment.patient || appointment.patientId;
            const doctor = appointment.doctor || appointment.doctorId;
            return (<div key={id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">
                    {typeof patient === "object" ? patient?.name : "Patient"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {typeof doctor === "object" ? doctor?.name : "Doctor"} · {appointment.date?.slice(0, 10)} · {appointment.time}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {appointment.purpose || "Appointment"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{appointment.status}</Badge>
                  {appointment.status === "PENDING" && (<Button size="sm" onClick={() => void handleConfirm(id)}>
                      Confirm
                    </Button>)}
                </div>
              </div>);
        })}

          {!loading && visibleAppointments.length === 0 && (<p className="p-10 text-center text-sm text-zinc-500">
              No appointments match this filter.
            </p>)}
          {loading && (<p className="p-10 text-center text-sm text-zinc-500">
              Loading appointments…
            </p>)}
        </div>
      </Card>

      <Modal open={modalOpen} title="Create appointment" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <label className="block text-sm font-medium">
            Doctor
            <select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm" value={form.doctorId} onChange={(event) => updateForm("doctorId", event.target.value)} required>
              <option value="">Select a doctor</option>
              {activeDoctors.map((doctor) => (<option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                  {doctor.name}
                  {doctor.specialization ? ` · ${doctor.specialization}` : ""}
                </option>))}
            </select>
            {activeDoctors.length === 0 && (<span className="mt-1 block text-xs text-amber-700">
                No active doctors found. Add a doctor first.
              </span>)}
          </label>

          <label className="block text-sm font-medium">
            Patient
            <select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm" value={form.patientId} onChange={(event) => updateForm("patientId", event.target.value)} required>
              <option value="">Select a patient</option>
              {patients.map((patient) => (<option key={patient._id || patient.id} value={patient._id || patient.id}>
                  {patient.name} · {patient.phone}
                </option>))}
            </select>
            {patients.length === 0 && (<span className="mt-1 block text-xs text-amber-700">
                No patients yet. A patient must submit the public booking form first.
              </span>)}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Date
              <Input className="mt-1.5" type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(event) => updateForm("date", event.target.value)} required/>
            </label>
            <label className="block text-sm font-medium">
              Time
              <Input className="mt-1.5" type="time" value={form.time} onChange={(event) => updateForm("time", event.target.value)} required/>
            </label>
          </div>

          <label className="block text-sm font-medium">
            Purpose
            <Input className="mt-1.5" value={form.purpose} onChange={(event) => updateForm("purpose", event.target.value)} maxLength={300} required/>
          </label>

          <Button className="w-full" disabled={saving || !activeDoctors.length || !patients.length}>
            {saving ? "Creating…" : "Create appointment"}
          </Button>
        </form>
      </Modal>
    </div>);
}

