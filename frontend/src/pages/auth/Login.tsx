import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuthStore } from "@/stores/authStore";
export default function Login() {
    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    async function submit(e: FormEvent) { e.preventDefault(); setError(""); try {
        await login(email, password);
        navigate("/dashboard");
    }
    catch (err) {
        setError(err instanceof Error ? err.message : "Unable to login");
    } }
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
<Card className="w-full max-w-md p-6 sm:p-8">
<div className="mb-8">
<div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 font-bold text-white">C</div>
<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
<p className="mt-1 text-sm text-zinc-500">Sign in to manage your clinic.</p>
</div>{error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}<form onSubmit={submit} className="space-y-4">
<label className="block text-sm font-medium">Email<Input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
</label>
<label className="block text-sm font-medium">Password<Input className="mt-1.5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
</label>
<Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
</form>
<p className="mt-6 text-center text-sm text-zinc-500">New clinic? <Link className="font-medium text-zinc-900 hover:underline" to="/signup">Create an account</Link>
</p>
</Card>
</div>;
}

