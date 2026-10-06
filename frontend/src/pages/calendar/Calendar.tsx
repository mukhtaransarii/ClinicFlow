import { useEffect } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useDataStore } from "@/stores/dataStore";
export default function Calendar() { const { appointments, loadAll } = useDataStore(); useEffect(() => { if (!appointments.length)
    loadAll(); }, [appointments.length, loadAll]); const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }); return <div className="space-y-6">
<div>
<p className="text-sm text-zinc-500">Schedule</p>
<h1 className="text-2xl font-semibold">Calendar</h1>
</div>
<div className="grid gap-4 lg:grid-cols-7">{days.map(day => { const key = day.toISOString().slice(0, 10); const items = appointments.filter(a => a.date?.slice(0, 10) === key); return <Card key={key} className="min-h-48 p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-xs text-zinc-500">{day.toLocaleDateString("en-IN", { weekday: "short" })}</p>
<p className="text-lg font-semibold">{day.getDate()}</p>
</div>
<span className="text-xs text-zinc-400">{items.length}</span>
</div>
<div className="mt-4 space-y-2">{items.map((a, i) => <div key={a.id || a._id || i} className="rounded-lg border border-zinc-100 bg-zinc-50 p-2">
<p className="text-xs font-medium">{a.time}</p>
<p className="truncate text-xs text-zinc-500">{a.patient?.name || "Patient"}</p>
<Badge className="mt-1">{a.status}</Badge>
</div>)}</div>
</Card>; })}</div>
</div>; }

