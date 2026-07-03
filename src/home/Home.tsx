
import Header from '../component/header'
import ProfileModalEdit from '../component/profile_model_edit'
import UserProfile from '../component/user_profile'
import TodoInput from '../component/input_box'
import TodoStats from '../component/state'
import TodoList from '../component/todo_list'
import { useEffect, useState } from 'react'
import { userData } from '../api/api'



interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}
function Home() {

  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [username, setUsername] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.filter(todo => !todo.completed).length

  const handleSaveProfile = (newName: string) => {
    setUsername(newName)
    setIsEditModalOpen(false)
  }
// const [initials, setInitials] = useState('');

    useEffect(()=>{
      const getData = async () => {
      try {
        const data = await userData();
        console.log('Fetched user data:', data[0].username);
        setUsername(data[0].username) ;

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } 
      getData();
    },[]) ;
  return (
    <>
 <main className="min-h-screen bg-background pb-12">
      {/* Profile Edit Modal */}
      <ProfileModalEdit
        isOpen={isEditModalOpen}
        username={username}
        onSave={handleSaveProfile}
        onClose={() => setIsEditModalOpen(false)}
      />
     <div className="fixed top-4 right-4 z-50">
        <UserProfile
          username={username}
          onProfileClick={() => setIsEditModalOpen(true)}
        />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        
        <div className="mb-8 mt-8">
          <TodoInput onAdd={addTodo} />
        </div>

        <div className="mb-6">
          <TodoStats
            total={todos.length}
            completed={completedCount}
            active={activeCount}
          />
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === 'active'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === 'completed'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            Completed
          </button>
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

        {todos.length > 0 && completedCount > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={clearCompleted}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Clear completed
            </button>
          </div>
        )}

        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-12">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-lg font-semibold text-foreground mb-1">
              No tasks yet
            </p>
            <p className="text-muted-foreground">
              Create your first task to get started
            </p>
          </div>
        )}
      </div>
    </main>
    </>
    )
}

export default Home