export default function Empty({ title, description }: {
    title: string;
    description: string;
}) {
    return <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
<h3 className="font-medium">{title}</h3>
<p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
</div>;
}

