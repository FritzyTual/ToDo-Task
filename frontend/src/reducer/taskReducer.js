// src/reducer/taskReducer.js
function taskReducer(tasks, action) {
    switch (action.type) {
        case "ADD_TASK":
            return [
                ...tasks,
                {
                    ...action.task,
                    completed: false
                }
            ];
        case "SET_TASKS":
            return action.payload;
        case "REMOVE_TASK":
            return tasks.filter(task => task._id !== action.id);
        case "MARK_DONE":
            return tasks.map(task =>
                task._id === action.id ? { ...task, completed: !task.completed } : task
            );
        case "EDIT_TASK":
            return tasks.map(task =>
                task._id === action.id ? { ...task, title: action.title, description: action.description } : task
            );
        default:
            throw new Error("Unknown Action: " + action.type);
    }
}

export default taskReducer;
