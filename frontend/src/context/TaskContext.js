import React, { createContext, useReducer, useEffect } from 'react';
import axios from '../Axios/axios';
import taskReducer from '../reducer/taskReducer';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, dispatch] = useReducer(taskReducer, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('/task/getTask', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                });
                dispatch({ type: 'SET_TASKS', payload: res.data });
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const removeTask = async (id) => {
        try {
            await axios.post('/task/removeTask', { id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            dispatch({ type: 'REMOVE_TASK', id });
        } catch (error) {
            console.error('Error removing task:', error);
        }
    };

    const editTask = async (id, title, description) => {
        try {
            await axios.post('/task/updateTask', { id, title, description }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            dispatch({ type: 'EDIT_TASK', id, title, description });
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, dispatch, removeTask, editTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContext;
