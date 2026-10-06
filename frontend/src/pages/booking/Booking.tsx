import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
type Doctor = {
    _id: string;
    name: string;
    specialization?: string;
};
export default function Booking() {
    const { clinicSlug = "" } = useParams();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [slots, setSlots] = useState<string[]>([]);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", email: "", purpose: "", doctorId: "", date: "", time: "" });
    useEffect(() => {
        api<{
            doctors: Doctor[];
        }>(`/booking/${clinicSlug}/doctors`).then((data) => setDoctors(data.doctors || [])).catch(() => setDoctors([]));
    }, [clinicSlug]);
    useEffect(() => {
        if (!form.doctorId || !form.date) {
            setSlots([]);
            return;
        }
        api<{
            slots: string[];
        }>(`/booking/${clinicSlug}/slots?doctorId=${form.doctorId}&date=${form.date}`).then((data) => setSlots(data.slots || [])).catch(() => setSlots([]));
    }, [clinicSlug, form.doctorId, form.date]);
    function set(field: keyof typeof form, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
    }
    async function submit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        try {
            await api(`/booking/${clinicSlug}/appointments`, { method: "POST", body: JSON.stringify({ doctorId: form.doctorId, date: form.date, time: form.time, purpose: form.purpose, patient: { name: form.name, phone: form.phone, email: form.email } }) });
            setSent(true);
        }
        finally {
            setLoading(false);
        }
    }
    return <div className="min-h-screen bg-zinc-50 p-4 sm:p-8">
<div className="mx-auto max-w-xl">
<div className="mb-6">
<p className="text-sm text-zinc-500">ClinicFlow booking</p>
<h1 className="mt-1 text-2xl font-semibold">Book an appointment</h1>
<p className="text-sm text-zinc-500">Clinic: {clinicSlug}</p>
</div>
<Card className="p-6">{sent ? <div className="py-10 text-center">
<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white">✓</div>
<h2 className="mt-4 text-lg font-semibold">Request received</h2>
<p className="mt-1 text-sm text-zinc-500">The clinic will confirm your appointment.</p>
</div> : <form onSubmit={submit} className="space-y-4">
<label className="block text-sm font-medium">Name<Input className="mt-1.5" value={form.name} onChange={(e) => set("name", e.target.value)} required/>
</label>
<label className="block text-sm font-medium">Phone<Input className="mt-1.5" value={form.phone} onChange={(e) => set("phone", e.target.value)} required/>
</label>
<label className="block text-sm font-medium">Email<Input className="mt-1.5" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}/>
</label>
<label className="block text-sm font-medium">Purpose<Input className="mt-1.5" value={form.purpose} onChange={(e) => set("purpose", e.target.value)} required/>
</label>
<label className="block text-sm font-medium">Doctor<select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm" value={form.doctorId} onChange={(e) => set("doctorId", e.target.value)} required>
<option value="">Select doctor</option>{doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}{doctor.specialization ? ` · ${doctor.specialization}` : ""}</option>)}</select>
</label>
<div className="grid gap-4 sm:grid-cols-2">
<label className="block text-sm font-medium">Date<Input className="mt-1.5" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required/>
</label>
<label className="block text-sm font-medium">Time<select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm" value={form.time} onChange={(e) => set("time", e.target.value)} required>
<option value="">Select time</option>{slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select>
</label>
</div>
<Button className="w-full" disabled={loading}>{loading ? "Booking..." : "Request appointment"}</Button>
</form>}</Card>
</div>
</div>;
}

