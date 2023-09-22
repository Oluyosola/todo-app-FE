import { useMutation, useQuery } from "@tanstack/react-query"
import { createTodo, deleteCompleted, deleteTodo, getTodos, markIsComplete, updateTodo } from "./api"

export const useGetTodos = ({ filters }) => {
    return useQuery({
        queryFn: getTodos,
        queryKey: ['getTodo', filters?.is_complete],
    })
}

export const useUpdateTodos = () => {
    return useMutation({
        mutationFn: updateTodo,
        mutationKey: ['updateTodo'],
    })
}

export const useDeleteeTodos = ({ onSuccess }) => {
    return useMutation({
        mutationFn: deleteTodo,
        mutationKey: ['deleteTodo'],
        onSuccess
    })
}
export const useDeleteCompletedTodos = ({ onSuccess }) => {
    return useMutation({
        mutationFn: deleteCompleted,
        mutationKey: ['deleteCompleted'],
        onSuccess
    })
}

export const useCreateTodos = () => {
    return useMutation({
        mutationFn: createTodo,
        mutationKey: ['deleteTodo'],
        onSuccess: () => alert('todo created successfully'),
        onError: err => alert(err?.response?.data?.message || err?.message)
    })
}
export const useMarkTodo = ({ onSuccess }) => {
    return useMutation({
        mutationFn: markIsComplete,
        mutationKey: ['markIsComplete'],
        onSuccess: () => { alert('todo updated successfully'); onSuccess() }
    })
}