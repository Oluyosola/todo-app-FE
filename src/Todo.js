import React, { useEffect, useState } from 'react';

// import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';

import './assets/css/styles.css';
import { Card, FormCheck } from 'react-bootstrap';
import { getTodos } from './core/api';
import { useCreateTodos, useDeleteCompletedTodos, useDeleteeTodos, useGetTodos, useMarkTodo, useUpdateTodos } from './core/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorRing } from 'react-loader-spinner';

const Todo = () => {
    const queryClient = new QueryClient
    const [todos, setTodos] = useState([])
    const [selectedTodo, setSelectedTodo] = useState({})
    const [filters, setFilters] = useState()
    const { data, isLoading, refetch } = useGetTodos({ filters })
    const { mutate: createTodo, isLoading: isCreatingTodo } = useCreateTodos()
    const { mutate: clearAllCompleted, isLoading: isClearingTodos } = useDeleteCompletedTodos({
        onSuccess: () => {
            refetch()
            alert('All completed todos has been cleared')
        }
    })
    const td = data?.data?.todos?.data

    useEffect(() => {
        setTodos(td)
    }, [td])

    const TodoItem = ({ name, date, id, is_complete }) => {
        const [showEditIndex, setShowEditIndex] = useState(undefined)
        const [editstate, setEditstate] = useState({ name, date, id, })
        const { mutate: updateMutation } = useUpdateTodos()
        const { mutate: markIsComplete, isLoading: marking } = useMarkTodo({
            onSuccess: refetch
        })


        const { mutate: deleteTodo, isLoading: loadingDelete } = useDeleteeTodos({
            onSuccess: () => {
                refetch();
                alert('todo has been deleted ')
            }
        })
        return (
            <Card style={{ width: '50vw', margin: '10px auto' }}>
                <Card.Body>
                    <div className="row px-3 align-items-center todo-item rounded">
                        <div className="col-auto m-1 p-0 d-flex align-items-center">
                            {marking ?
                                <ColorRing
                                    visible={true}
                                    height="20"
                                    width="20"
                                    ariaLabel="blocks-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="blocks-wrapper"
                                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                />
                                : <input onChange={e => {
                                    markIsComplete({
                                        is_complete: is_complete ? 0 : 1,
                                        id
                                    })
                                }} type='checkbox' defaultChecked={!!is_complete} />}
                        </div>
                        <div className="col px-1 m-1 d-flex align-items-center">
                            {
                                showEditIndex === id ?
                                    <input value={editstate.title}
                                        onBlur={e => {
                                            e.preventDefault()
                                            let sel = todos.filter(t => t.id !== id)
                                            let newArray = [...sel, { ...editstate }]
                                            updateMutation({
                                                title: editstate.title,
                                                due_date: editstate?.date,
                                                id
                                            })
                                            setTodos(newArray)
                                            setShowEditIndex(undefined)

                                        }}
                                        onChange={e => {
                                            setEditstate(p => ({ ...p, title: e.target.value }))
                                        }} /> : <h2>{name}</h2>
                            }

                        </div>
                        <div className="col-auto m-1 p-0 px-3 d-none">
                        </div>
                        <div className="col-auto m-1 p-0 todo-actions">
                            <div className="row d-flex align-items-center justify-content-end">
                                <h5 onClick={e => {
                                    e.preventDefault()
                                    setShowEditIndex(id)
                                }} className="m-0 p-0 px-2">
                                    <i className="fa fa-pencil text-info btn m-0 p-0" data-toggle="tooltip" data-placement="bottom" title="Edit todo"></i>
                                </h5>
                                <h5 onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this todo?')) {
                                        deleteTodo(id)
                                    }
                                }} className="m-0 p-0 px-2">
                                    <i className="fa fa-trash-o text-danger btn m-0 p-0" data-toggle="tooltip" data-placement="bottom" title="Delete todo"></i>
                                </h5>
                            </div>
                            <div className="row todo-created-info">
                                <div className="col-auto d-flex align-items-center pr-2">
                                    <i className="fa fa-info-circle my-2 px-2 text-black-50 btn" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Created date"></i>
                                    <label className="date-label my-2 text-black-50">{date}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Container classNameName="container-custom">
                <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
                    <div className="row m-1 p-4">
                        <div className="col">
                            <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
                                <i className="fa fa-check bg-primary text-white rounded p-2"></i>
                                <u>My Todos</u>
                            </div>
                        </div>
                    </div>
                    <div className="row m-1 p-3">
                        <div className="col col-11 mx-auto">
                            <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
                                <div className="col">
                                    {isClearingTodos ? <>
                                        <ColorRing
                                            visible={true}
                                            height="50"
                                            width="50"
                                            ariaLabel="blocks-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="blocks-wrapper"
                                            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                        />
                                    </> : <button onClick={e => {
                                        e.preventDefault()
                                        if (window.confirm("Are you sure you want to clear all completed todos?")) {
                                            clearAllCompleted()
                                        }
                                    }} className="btn btn-danger">clear Completed</button>}
                                </div>
                                <div className="col">
                                    <input
                                        onChange={e => {
                                            setSelectedTodo(prev => ({ ...prev, title: e.target.value, id: todos?.length + 1 }))
                                        }}
                                        className="form-control form-control-lg border-0 add-todo-input bg-transparent rounded" type="text" placeholder="Add new .." />
                                </div>
                                <div className="col-auto m-0 px-2 d-flex align-items-center">
                                    <label className="text-secondary my-2 p-0 px-1 view-opt-label due-date-label d-none">Due date not set</label>
                                    <input
                                        onChange={e => {
                                            setSelectedTodo(prev => ({ ...prev, due_date: e.target.value }))
                                        }} type='datetime-local' className='form-control' />
                                </div>
                                <div className="col-auto px-0 mx-0 mr-2">
                                    {
                                        isCreatingTodo ? <ColorRing
                                            visible={true}
                                            height="50"
                                            width="50"
                                            ariaLabel="blocks-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="blocks-wrapper"
                                            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                        /> :
                                            <button onClick={e => {
                                                e.preventDefault()
                                                let data = [...todos, { ...selectedTodo }]
                                                createTodo({ ...selectedTodo });
                                                setTodos(data)
                                            }} type="button" className="btn btn-primary">Add</button>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 mx-4 border-black-25 border-bottom"></div>
                    <div className="row m-1 p-3 px-5 justify-content-end">
                        <div className="col-auto d-flex align-items-center">
                            <label className="text-secondary my-2 pr-2 view-opt-label">Filter</label>
                            <select onChange={e => setFilters({ is_complete: e.target.value })} className="custom-select custom-select-sm btn my-2">
                                <option value={'All'} >All</option>
                                <option value={1}>Completed</option>
                                <option value={0}>Active</option>
                            </select>
                        </div>

                    </div>

                </div>

                {
                    isLoading ? <div style={{ margin: 'auto', justifyContent: 'center', display: 'flex' }}>
                        <ColorRing
                            visible={true}
                            height="50"
                            width="50"
                            ariaLabel="blocks-loading"
                            wrapperStyle={{}}
                            wrapperClass="blocks-wrapper"
                            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                        />
                    </div> :

                        todos?.length > 0 ?
                            todos.map((t, i) =>
                                <div className="handle">
                                    <TodoItem is_complete={t.is_complete} name={t.title} date={t.due_date} id={t.id} />
                                </div>
                            )


                            : <h3> No todos to display</h3>
                }

            </Container>
        </QueryClientProvider>)
};

export default Todo;
