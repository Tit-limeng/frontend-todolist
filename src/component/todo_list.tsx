// interface Todo {
//   todo_id: string
//   title: string,
//   description : string ,
//   status : string ;
//   priority : string
//   completed: boolean,
//   due_date : Date ,
//   createdAt: Date
// }
// "title": "hello kitty",
//             "description": "test",
//             "status": "pending",
//             "priority": "low",
//             "due_date": "2026-07-19T17:00:00.000Z",
//             "created_at": "2026-07-05T17:06:50.501Z",
//             "updated_at": "2026-07-05T17:06:50.501Z"
import type { Todo } from '../types/task'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.todo_id}
          className="group flex items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3 transition-all hover:border-primary/30 hover:bg-secondary"
        >
          <button
            onClick={() => onToggle(todo.todo_id)}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              todo.completed
                ? 'bg-primary border-primary'
                : 'border-border hover:border-primary'
            }`}
          >
            {todo.completed && (
              <svg
                className="w-4 h-4 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>

          <span
            className={`flex-1 text-lg transition-all ${
              todo.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground'
            }`}
          >
            {todo.title}
          </span>

          <button
            onClick={() => onDelete(todo.todo_id)}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
