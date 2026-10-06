import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("rounded-xl border border-zinc-200 bg-white", className)} {...props}/>;
}

