import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md";
};
export default function Button({ className, variant = "primary", size = "md", ...props }: Props) {
    const variants = {
        primary: "bg-zinc-900 text-white hover:bg-zinc-800",
        secondary: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };
    return <button className={cn("inline-flex items-center justify-center rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50", size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm", variants[variant], className)} {...props}/>;
}

