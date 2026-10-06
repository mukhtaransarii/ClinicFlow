import { useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useDataStore } from "@/stores/dataStore";
import { useClinicStore } from "@/stores/clinicStore";
import { Link } from "react-router";
export default function Dashboard() { const { doctors, patients, appointments, loadAll } = useDataStore(); const clinic = useClinicStore(s => s.clinic); const loadClinic = useClinicStore(s => s.load); useEffect(() => { loadAll(); loadClinic(); }, [loadAll, loadClinic]); const today = new Date().toISOString().slice(0, 10); const todays = appointments.filter(a => a.date?.slice(0, 10) === today); return <div className="space-y-6">
<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
<div>
<p className="text-sm text-zinc-500">Overview</p>
<h1 className="text-2xl font-semibold tracking-tight">{clinic?.name || "Dashboard"}</h1>
</div>
<Link to="/appointments">
<Button>New appointment</Button>
</Link>
</div>
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Appointments", appointments.length], ["Today", todays.length], ["Doctors", doctors.length], ["Patients", patients.length]].map(([label, value]) => <Card key={String(label)} className="p-5">
<p className="text-sm text-zinc-500">{label}</p>
<p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
</Card>)}</div>
<Card>
<div className="flex items-center justify-between border-b border-zinc-100 p-5">
<div>
<h2 className="font-semibold">Upcoming appointments</h2>
<p className="text-sm text-zinc-500">Your latest clinic activity.</p>
</div>
<Link className="text-sm font-medium" to="/appointments">View all</Link>
</div>
<div className="divide-y divide-zinc-100">{appointments.slice(0, 6).map((a, i) => <div key={a.id || a._id || i} className="flex items-center justify-between p-5">
<div>
<p className="text-sm font-medium">{a.patient?.name || "Patient"}</p>
<p className="text-xs text-zinc-500">{a.doctor?.name || "Doctor"} · {a.time}</p>
</div>
<Badge>{a.status}</Badge>
</div>)}{appointments.length === 0 && <p className="p-8 text-center text-sm text-zinc-500">No appointments yet.</p>}</div>
</Card>
</div>; }

