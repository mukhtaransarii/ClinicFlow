import { NavLink } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
const items = [
    ["Dashboard", "/dashboard"], ["Appointments", "/appointments"], ["Calendar", "/calendar"], ["Schedules", "/schedules"], ["Doctors", "/doctors"], ["Patients", "/patients"], ["Notifications", "/notifications"], ["Settings", "/settings"],
];
export default function Sidebar() {
    const clinic = useAuthStore((s) => s.user?.clinic);
    return <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
    <div className="flex h-16 items-center border-b border-zinc-100 px-5">
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white">C</div>
<div className="ml-3 min-w-0">
<p className="truncate text-sm font-semibold">ClinicFlow</p>
<p className="truncate text-xs text-zinc-500">{clinic?.name || "Your clinic"}</p>
</div>
</div>
    <nav className="flex-1 space-y-1 p-3">{items.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => cn("block rounded-lg px-3 py-2 text-sm font-medium", isActive ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900")}>{label}</NavLink>)}</nav>
    <div className="border-t border-zinc-100 p-3 text-xs text-zinc-400">Clinic admin</div>
  </aside>;
}

