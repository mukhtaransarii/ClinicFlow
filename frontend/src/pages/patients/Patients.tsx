import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Empty from "@/components/ui/Empty";
import { useDataStore } from "@/stores/dataStore";
export default function Patients() { const { patients, loadAll } = useDataStore(); const [q, setQ] = useState(""); useEffect(() => { if (!patients.length)
    loadAll(); }, [patients.length, loadAll]); const filtered = patients.filter(p => `${p.name} ${p.phone} ${p.email || ""}`.toLowerCase().includes(q.toLowerCase())); return <div className="space-y-6">
<div>
<p className="text-sm text-zinc-500">Clinic records</p>
<h1 className="text-2xl font-semibold">Patients</h1>
</div>
<Card className="p-4">
<Input placeholder="Search patients..." value={q} onChange={e => setQ(e.target.value)}/>
</Card>
<Card className="overflow-hidden">
<div className="grid grid-cols-[1fr_180px_220px] border-b border-zinc-100 px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
<span>Name</span>
<span>Phone</span>
<span>Email</span>
</div>{filtered.map(p => <div key={p.id || p._id} className="grid grid-cols-[1fr_180px_220px] border-b border-zinc-100 px-5 py-4 text-sm">
<span className="font-medium">{p.name}</span>
<span className="text-zinc-500">{p.phone}</span>
<span className="text-zinc-500">{p.email || "—"}</span>
</div>)}{!filtered.length && <Empty title="No patients found" description="Patients will appear here after they book an appointment."/>}</Card>
</div>; }

