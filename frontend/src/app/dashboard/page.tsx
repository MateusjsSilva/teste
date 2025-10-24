"use client";

import { useState } from 'react'
import Sidebar from './sidebar'
import { ModalTask } from './modalTask'
import { ModalEditTask } from './modalEditTask'
import { TaskList } from './taskList'
import { Task } from '@/lib/taskService'

export default function Page() {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleSave() {
        // Força a atualização da lista de tarefas
        setRefreshKey(prev => prev + 1);
    }

    function handleEdit(task: Task) {
        console.log("handleEdit chamado com task:", task);
        setSelectedTask(task);
        setEditOpen(true);
        console.log("Modal de edição deve estar aberto agora");
    }

    return (
        <main className="bg-white">
            <div className="w-full px-4 py-6 lg:px-8">
                <div className="grid grid-cols-1 min-h-[calc(100vh-4rem)] gap-16 lg:grid-cols-[320px_1fr]">
                    <aside className="rounded-2xl h-auto bg-[#6FA4FF] text-white">
                        <Sidebar />
                    </aside>
                    <section className="flex flex-col">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">Tarefas</h1>
                                <p className="mt-2 text-gray-600">Mantenha o foco! Uma tarefa de cada vez.</p>
                            </div>
                            <button
                                onClick={() => setOpen(true)}
                                className="mt-1 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none cursor-pointer">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-800 text-white">+</span>
                                Criar Tarefa
                            </button>
                        </div>
                        <div className="mt-8">
                            <TaskList 
                                key={refreshKey}
                                onEdit={handleEdit}
                                onDelete={(taskId) => {
                                    console.log("Excluir tarefa:", taskId);
                                    handleSave(); // Atualiza a lista
                                }}
                                onStatusChange={(taskId, status) => {
                                    console.log("Status alterado:", taskId, status);
                                    handleSave(); // Atualiza a lista
                                }}
                            />
                        </div>
                    </section>
                </div>
            </div>
            <ModalTask open={open} onOpenChange={setOpen} onSave={handleSave} />
            <ModalEditTask 
                open={editOpen} 
                onOpenChange={setEditOpen} 
                task={selectedTask}
                onSave={handleSave} 
            />
        </main>
    )
}