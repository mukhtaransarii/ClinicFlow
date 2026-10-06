import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useDataStore } from "@/stores/dataStore";
export default function Doctors() { const { doctors, loadAll, createDoctor } = useDataStore(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ name: "", phone: "", specialization: "" }); useEffect(() => { if (!doctors.length)
    loadAll(); }, [doctors.length, loadAll]); async function submit(e: FormEvent) { e.preventDefault(); await createDoctor(form); setForm({ name: "", phone: "", specialization: "" }); setOpen(false); } return <div className="space-y-6">
<div className="flex items-end justify-between">
<div>
<p className="text-sm text-zinc-500">Team</p>
<h1 className="text-2xl font-semibold">Doctors</h1>
</div>
<Button onClick={() => setOpen(true)}>Add doctor</Button>
</div>
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{doctors.map(d => <Card key={d.id || d._id} className="p-5">
<div className="flex items-start justify-between">
<div>
<h2 className="font-semibold">{d.name}</h2>
<p className="mt-1 text-sm text-zinc-500">{d.specialization || "General practitioner"}</p>
</div>
<Badge>{d.active === false ? "Inactive" : "Active"}</Badge>
</div>
<p className="mt-5 text-sm text-zinc-500">{d.phone || "No phone added"}</p>
</Card>)}</div>
<Modal open={open} title="Add doctor" onClose={() => setOpen(false)}>
<form onSubmit={submit} className="space-y-4">
<label className="block text-sm font-medium">Name<Input className="mt-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required/>
</label>
<label className="block text-sm font-medium">Specialization<Input className="mt-1" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}/>
</label>
<label className="block text-sm font-medium">Phone<Input className="mt-1" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
</label>
<Button className="w-full">Create doctor</Button>
</form>
</Modal>
</div>; }

