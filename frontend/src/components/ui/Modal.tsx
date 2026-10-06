import type { ReactNode } from "react";
import Button from "./Button";
type Props = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
};
export default function Modal({ open, title, children, onClose }: Props) {
    if (!open)
        return null;
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onMouseDown={onClose}>
    <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
      <div className="mb-5 flex items-center justify-between">
<h2 className="text-lg font-semibold">{title}</h2>
<Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
</div>
      {children}
    </div>
  </div>;
}

