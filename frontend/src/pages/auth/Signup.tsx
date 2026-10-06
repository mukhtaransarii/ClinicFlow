import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAuthStore } from "@/stores/authStore";

export default function Signup() {
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function setField(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: event.target.value });
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      await signup(form);
      navigate("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create account.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-semibold">Create your clinic</h1>
        <p className="mt-1 text-sm text-zinc-500">
          The account you create becomes the clinic admin. The current backend creates a default
          clinic name from your name; you can change it later in Settings.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Your name
            <Input className="mt-1.5" value={form.name} onChange={setField("name")} required />
          </label>
          <label className="block text-sm font-medium">
            Email
            <Input
              className="mt-1.5"
              type="email"
              value={form.email}
              onChange={setField("email")}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <Input
              className="mt-1.5"
              type="password"
              value={form.password}
              onChange={setField("password")}
              minLength={8}
              required
            />
          </label>
          <Button className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create clinic"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link className="font-medium text-zinc-900" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
