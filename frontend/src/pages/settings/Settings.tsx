import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useClinicStore } from "@/stores/clinicStore";
export default function Settings() { const { clinic, load, update, loading } = useClinicStore(); const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" }); useEffect(() => { load(); }, [load]); useEffect(() => { if (clinic)
    setForm({ name: clinic.name || "", phone: clinic.phone || "", email: clinic.email || "", address: clinic.address || "" }); }, [clinic]); async function submit(e: FormEvent) { e.preventDefault(); await update(form); } return <div className="max-w-2xl space-y-6">
<div>
<p className="text-sm text-zinc-500">Configuration</p>
<h1 className="text-2xl font-semibold">Clinic settings</h1>
</div>
<Card className="p-6">
<form onSubmit={submit} className="space-y-5">
<label className="block text-sm font-medium">Clinic name<Input className="mt-1.5" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
</label>
<div className="grid gap-5 sm:grid-cols-2">
<label className="block text-sm font-medium">Phone<Input className="mt-1.5" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
</label>
<label className="block text-sm font-medium">Email<Input className="mt-1.5" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
</label>
</div>
<label className="block text-sm font-medium">Address<Input className="mt-1.5" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}/>
</label>
<Button disabled={loading}>Save changes</Button>
</form>
</Card>
</div>; }

