"use client";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/auth";

export default function Sidebar() {
    const router = useRouter();

    function handleLogout() {
        clearAuthToken();
        router.push("/login");
    }

    return (
        <div className="flex h-full flex-col justify-between p-6">
            <div>
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-6">
                    <h2 className="text-xl font-bold text-white">Task Manager</h2>
                    <p className="text-center text-sm leading-relaxed text-white/90">
                        Organize suas tarefas de forma eficiente
                    </p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-xl bg-white/20 px-4 py-3 text-center text-base font-medium text-white hover:bg-white/25 focus:outline-none cursor-pointer">
                Sair
            </button>
        </div>
    )
}
