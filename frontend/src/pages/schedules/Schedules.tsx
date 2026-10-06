import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useDataStore, type Doctor } from "@/stores/dataStore";
type Schedule = {
    _id?: string;
    id?: string;
    doctorId: string | Doctor;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
};
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function Schedules() {
    const { doctors, loadAll } = useDataStore();
    const [items, setItems] = useState<Schedule[]>([]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        doctorId: "",
        dayOfWeek: "1",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: "30",
    });
    async function loadSchedules() {
        const response = await api<{
            schedules: Schedule[];
        }>("/schedules");
        setItems(response.schedules ?? []);
    }
    useEffect(() => {
        void Promise.all([loadAll(), loadSchedules()]).catch((cause: unknown) => {
            setError(cause instanceof Error ? cause.message : "Could not load schedules.");
        });
    }, [loadAll]);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
            await api("/schedules", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    dayOfWeek: Number(form.dayOfWeek),
                    slotDuration: Number(form.slotDuration),
                }),
            });
            await loadSchedules();
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not save schedule.");
        }
        finally {
            setSaving(false);
        }
    }
    return (<div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-500">Availability</p>
        <h1 className="text-2xl font-semibold">Schedules</h1>
      </div>

      {error && (<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>)}

      <Card className="p-5">
        <h2 className="font-semibold">Add weekly schedule</h2>
        <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block text-sm font-medium">
            Doctor
            <select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm" value={form.doctorId} onChange={(event) => setForm({ ...form, doctorId: event.target.value })} required>
              <option value="">Select doctor</option>
              {doctors
            .filter((doctor) => doctor.active !== false)
            .map((doctor) => (<option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                    {doctor.name}
                  </option>))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Day
            <select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm" value={form.dayOfWeek} onChange={(event) => setForm({ ...form, dayOfWeek: event.target.value })}>
              {days.map((day, index) => (<option key={day} value={index}>{day}</option>))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Slot duration (minutes)
            <Input className="mt-1.5" type="number" min={5} step={5} value={form.slotDuration} onChange={(event) => setForm({ ...form, slotDuration: event.target.value })} required/>
          </label>
          <label className="block text-sm font-medium">
            Start time
            <Input className="mt-1.5" type="time" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} required/>
          </label>
          <label className="block text-sm font-medium">
            End time
            <Input className="mt-1.5" type="time" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} required/>
          </label>
          <div className="flex items-end">
            <Button className="w-full" disabled={saving || !doctors.length}>
              {saving ? "Saving…" : "Add schedule"}
            </Button>
          </div>
        </form>
        {!doctors.length && (<p className="mt-3 text-xs text-zinc-500">Add a doctor before configuring availability.</p>)}
      </Card>

      <Card className="divide-y divide-zinc-100">
        {items.map((item) => {
            const doctor = typeof item.doctorId === "string" ? null : item.doctorId;
            return (<div key={item.id || item._id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{days[item.dayOfWeek]}</p>
                <p className="text-sm text-zinc-500">
                  {doctor?.name || "Doctor"} · {item.startTime}–{item.endTime}
                </p>
              </div>
              <span className="text-xs text-zinc-500">{item.slotDuration} min slots</span>
            </div>);
        })}
        {!items.length && <p className="p-8 text-center text-sm text-zinc-500">No schedules configured.</p>}
      </Card>
    </div>);
}

