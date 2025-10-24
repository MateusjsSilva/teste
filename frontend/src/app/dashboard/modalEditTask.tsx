"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { taskUpdateSchema, TaskUpdateFormData, priorityLabels, statusLabels } from "@/lib/taskSchemas";
import { TaskService, Task, UpdateTaskData } from "@/lib/taskService";

type ModalEditTaskProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    onSave?: () => void;
};

export function ModalEditTask({ open, onOpenChange, task, onSave }: ModalEditTaskProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TaskUpdateFormData>({
        resolver: zodResolver(taskUpdateSchema),
    });

    const priority = watch("priority");
    const status = watch("status");

    // Atualiza o formulário quando a tarefa muda
    React.useEffect(() => {
        if (task) {
            console.log("Preenchendo formulário com task:", task);
            reset({
                title: task.title,
                description: task.description || "",
                priority: task.priority,
                status: task.status,
                due_date: task.due_date || "",
            });
        }
    }, [task, reset]);

    const onSubmit = async (data: TaskUpdateFormData) => {
        if (!task) {
            console.error("Nenhuma tarefa selecionada para edição");
            return;
        }

        try {
            console.log("Iniciando salvamento da tarefa:", task.id, "com dados:", data);
            setIsSubmitting(true);
            setError(null);

            const taskData: UpdateTaskData = {
                title: data.title,
                description: data.description || undefined,
                priority: data.priority,
                status: data.status,
                due_date: data.due_date || undefined,
            };

            console.log("Dados a serem enviados:", taskData);
            await TaskService.updateTask(task.id, taskData);
            
            console.log("Tarefa salva com sucesso!");
            onOpenChange(false);
            onSave?.();
        } catch (err) {
            console.error("Erro ao salvar tarefa:", err);
            setError(err instanceof Error ? err.message : "Erro ao atualizar tarefa");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            setError(null);
            onOpenChange(false);
        }
    };

    if (!open || !task) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-[560px] bg-white border-2 border-blue-200 shadow-xl">
                <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 -m-6 mb-4 rounded-t-lg border-b border-blue-100">
                    <DialogTitle className="text-xl font-bold text-blue-800">
                        Editar Tarefa
                    </DialogTitle>
                    <DialogDescription className="text-blue-600 mt-2">
                        Edite os campos abaixo e clique em <b>Salvar</b>.
                    </DialogDescription>
                </DialogHeader>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Formulário */}
                <form className="grid gap-5 bg-gray-50 p-4 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                    {/* Título */}
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-gray-800 font-semibold">
                            Título *
                        </Label>
                        <Input
                            id="title"
                            {...register("title")}
                            placeholder="Ex.: Preparar apresentação"
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm font-medium">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Prioridade e Status */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label className="text-gray-800 font-semibold">Prioridade</Label>
                            <Select
                                value={priority}
                                onValueChange={(value) => setValue("priority", value as any)}
                            >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-900 border-gray-200 shadow-lg">
                                    <SelectItem value="LOW">{priorityLabels.LOW}</SelectItem>
                                    <SelectItem value="MEDIUM">{priorityLabels.MEDIUM}</SelectItem>
                                    <SelectItem value="HIGH">{priorityLabels.HIGH}</SelectItem>
                                    <SelectItem value="URGENT">{priorityLabels.URGENT}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-gray-800 font-semibold">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(value) => setValue("status", value as any)}
                            >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-900 border-gray-200 shadow-lg">
                                    <SelectItem value="PENDING">{statusLabels.PENDING}</SelectItem>
                                    <SelectItem value="IN_PROGRESS">{statusLabels.IN_PROGRESS}</SelectItem>
                                    <SelectItem value="COMPLETED">{statusLabels.COMPLETED}</SelectItem>
                                    <SelectItem value="CANCELLED">{statusLabels.CANCELLED}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Prazo */}
                    <div className="grid gap-2">
                        <Label htmlFor="due_date" className="text-gray-800 font-semibold">
                            Data de Vencimento
                        </Label>
                        <Input
                            id="due_date"
                            type="date"
                            {...register("due_date")}
                            className="bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                    </div>

                    {/* Descrição */}
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-gray-800 font-semibold">
                            Descrição
                        </Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Detalhes, critérios de aceite, links, etc."
                            className="min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm font-medium">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-3 bg-white p-4 -m-4 rounded-b-lg border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-2 font-medium cursor-pointer"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium shadow-sm cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
