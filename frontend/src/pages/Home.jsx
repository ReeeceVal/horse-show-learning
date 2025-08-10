export default function Home() {
    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-slate-700">Navigation above works without reload.</p>

            <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="font-medium mb-1">System Status</h2>
                <p className="text-sm text-slate-600">Frontend running with Tailwind v3 ✅</p>
            </div>
        </section>
    )
}
