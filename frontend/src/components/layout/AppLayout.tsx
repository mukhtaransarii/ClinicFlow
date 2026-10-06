import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
export default function AppLayout() {
    return <div className="flex min-h-screen bg-zinc-50">
<Sidebar />
<div className="min-w-0 flex-1">
<Header />
<main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6">
<Outlet />
</main>
</div>
</div>;
}

