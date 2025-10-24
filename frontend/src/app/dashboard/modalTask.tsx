"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
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
import { taskCreateSchema, TaskCreateFormData, priorityLabels, statusLabels } from "@/lib/taskSchemas";
import { TaskService } from "@/lib/taskService";

type ModalTaskProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: () => void;
};

export function ModalTask({ open, onOpenChange, onSave }: ModalTaskProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<TaskCreateFormData>({
        resolver: zodResolver(taskCreateSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "MEDIUM",
            status: "PENDING",
            due_date: "",
        },
    });

    const priority = watch("priority");
    const status = watch("status");

    const onSubmit = async (data: TaskCreateFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);

            const taskData = {
                title: data.title,
                description: data.description || undefined,
                priority: data.priority,
                status: data.status,
                due_date: data.due_date || undefined,
            };

            await TaskService.createTask(taskData);
            
            reset();
            onOpenChange(false);
            onSave?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar tarefa");
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

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={(e) => {
                    if (e.target === e.currentTarget) handleClose();
                }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
                <div className="w-full max-w-[560px] rounded-2xl bg-white border border-blue-100 shadow-lg p-6 text-blue-900">
                    {/* Header */}
                    <div className="mb-4">
                        <h2
                            id="task-dialog-title"
                            className="text-xl font-bold text-blue-700"
                        >
                            Nova Tarefa
                        </h2>
                        <p className="text-blue-500">
                            Preencha os campos abaixo e clique em <b>Salvar</b>.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Formulário */}
                    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* Título */}
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-blue-900 font-medium">
                                Título *
                            </Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Ex.: Preparar apresentação"
                                className="bg-blue-50 border-blue-200 text-blue-900 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-300"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Prioridade e Status */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label className="text-blue-900 font-medium">Prioridade</Label>
                                <Select
                                    value={priority}
                                    onValueChange={(value) => setValue("priority", value as any)}
                                >
                                    <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-900 focus:ring-2 focus:ring-blue-300">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-blue-900 border-blue-200">
                                        <SelectItem value="LOW">{priorityLabels.LOW}</SelectItem>
                                        <SelectItem value="MEDIUM">{priorityLabels.MEDIUM}</SelectItem>
                                        <SelectItem value="HIGH">{priorityLabels.HIGH}</SelectItem>
                                        <SelectItem value="URGENT">{priorityLabels.URGENT}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-blue-900 font-medium">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(value) => setValue("status", value as any)}
                                >
                                    <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-900 focus:ring-2 focus:ring-blue-300">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-blue-900 border-blue-200">
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
                            <Label htmlFor="due_date" className="text-blue-900 font-medium">
                                Data de Vencimento
                            </Label>
                            <Input
                                id="due_date"
                                type="date"
                                {...register("due_date")}
                                className="bg-blue-50 border-blue-200 text-blue-900 focus:ring-2 focus:ring-blue-300"
                            />
                        </div>

                        {/* Descrição */}
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-blue-900 font-medium">
                                Descrição
                            </Label>
                            <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Detalhes, critérios de aceite, links, etc."
                                className="min-h-[120px] bg-blue-50 border-blue-200 text-blue-900 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-300"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
}