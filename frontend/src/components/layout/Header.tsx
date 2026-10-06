import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
export default function Header() {
    const { user, logout } = useAuthStore();
    return <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
<div>
<p className="text-sm font-semibold">Good to see you, {user?.name?.split(" ")[0] || "Admin"}</p>
<p className="hidden text-xs text-zinc-500 sm:block">Manage your clinic from one place.</p>
</div>
<Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
</header>;
}

