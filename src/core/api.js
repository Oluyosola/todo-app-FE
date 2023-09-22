import axios from 'axios'
const baseUrl = 'http://localhost/api/v1'


export const getTodos = ({ queryKey }) => new Promise((res, rej) => {
    const [, is_complete] = queryKey 
    let url = `${baseUrl}/todos`
    if (is_complete === 'All') {
        url = `${baseUrl}/todos`
    } else if (typeof is_complete !== 'undefined') {
        url += `?filter[is_complete]=${is_complete}`
    }
    console.log(typeof is_complete,  is_complete);
    axios.get(`${url}`).then(response => res(response.data)).catch(err => rej(err))
})

export const createTodo = data => new Promise((res, rej) => {
    axios.post(`${baseUrl}/todos`, { ...data }).then(response => res(response.data)).catch(err => rej(err))
})

export const getTodo = id => new Promise((res, rej) => {
    axios.get(`${baseUrl}/todos/${id}`).then(response => res(response.data)).catch(err => rej(err))
})
export const markIsComplete = ({ id, is_complete }) => new Promise((res, rej) => {
    axios.put(`${baseUrl}/todos/${id}/is-complete`, {
        is_complete
    }).then(response => res(response.data)).catch(err => rej(err))
})

export const updateTodo = data => new Promise((res, rej) => {
    axios.put(`${baseUrl}/todos/${data?.id}`, { ...data }).then(response => res(response.data)).catch(err => rej(err))
})

export const deleteTodo = id => new Promise((res, rej) => {
    axios.delete(`${baseUrl}/todos/${id}/force-delete`).then(response => res(response.data)).catch(err => rej(err))
})
export const deleteCompleted = () => new Promise((res, rej) => {
    axios.delete(`${baseUrl}/todos/clear-all-completed`).then(response => res(response.data)).catch(err => rej(err))
}) 