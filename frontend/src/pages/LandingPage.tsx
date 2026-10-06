import { Link } from "react-router";
import Button from "@/components/ui/Button";
export default function LandingPage() { return <div className="min-h-screen bg-white">
<header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
<div className="font-semibold">ClinicFlow</div>
<div className="flex gap-2">
<Link to="/login">
<Button variant="ghost">Sign in</Button>
</Link>
<Link to="/signup">
<Button>Start clinic</Button>
</Link>
</div>
</header>
<main className="mx-auto max-w-4xl px-4 py-24 text-center">
<p className="text-sm font-medium text-zinc-500">Simple clinic operations</p>
<h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Appointments, doctors and patients in one calm workspace.</h1>
<p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">Give your clinic a simple booking flow and a focused admin dashboard without unnecessary complexity.</p>
<Link to="/signup" className="mt-8 inline-block">
<Button>Get started</Button>
</Link>
</main>
</div>; }

