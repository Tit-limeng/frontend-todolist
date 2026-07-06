
import Header from '../component/header'
import ProfileModalEdit from '../component/profile_model_edit'
import UserProfile from '../component/user_profile'
import TodoInput from '../component/input_box'
import TodoStats from '../component/state'
import TodoList from '../component/todo_list'
import { useEffect, useState } from 'react'
import { userData, getUserTaskList, remoteTask } from '../api/api'
import type { Todo } from '../types/task'



// interface Todo {
//   id: string
//   text: string
//   completed: boolean
//   createdAt: Date
// }
function Home() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });
  // const [username, setUsername] = useState('') ;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);




  const openProfile = async () => {
    // if (!username) {
    //   const data = await userData();
    //   setUsername(data[0].username);
    // }
    setUser({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    setIsEditModalOpen(true);
  };
  const addTodo = (title :string,description: string , status : string , priority : string , due_date : Date) => {
    const newTodo: Todo = {
      todo_id: Date.now().toString(),
      title  ,
      description,
      status ,
      priority ,
      completed: false,
      due_date ,
      createdAt: new Date(),
  //     todo_id: string
  // title: string,
  // description : string ,
  // status : string ;
  // priority : string
  // completed: boolean,
  // due_date : Date ,
  // createdAt: Date
    }
    setTodos([newTodo, ...todos])
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // const deleteTodo = async () => {
  //   // setTodos(todos.filter(todo => todo.todo_id !== id))
  //   const todo_id = todos.find(todo => todo.todo_id);
  //   console.log('this is todo id :',todo_id) ;
  //   // const remote = await remoteTask(id) ;
  // }

  const deleteTodo = async (todo_id: string) => {
  try {
    const response = await remoteTask(todo_id);

    console.log(response);
    // Remove it from the UI after the API succeeds
    setTodos(prev => prev.filter(todo => todo.todo_id !== todo_id));
  } catch (error) {
    console.error(error);
  }
};

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
    setUser({
      ...user,
      username: newName
    });
    setIsEditModalOpen(false)
  }
  // const [initials, setInitials] = useState('');


  // const handleLogout = () => {
  //   console.log('Logout clicked');
  // }



  useEffect(() => {
    const getData = async () => {
      try {
        const data = await userData();
        // console.log('Fetched user data:', data[0].username);
        setUser({
          ...user,
          username: data[0].username,
          email: data[0].email,
          password: data[0].password
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    const getTaskList = async () => {
      const data = await getUserTaskList();
      setTodos(data);
      console.log(data) ;
    }
    getData();
    getTaskList();
  }, []);
  return (
    <>
      <main className="min-h-screen bg-background pb-12">
        {/* Profile Edit Modal */}
        <ProfileModalEdit
          isOpen={isEditModalOpen}
          username={user.username}
          email={user.email}
          password={user.password}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
        <div className="fixed top-4 right-4 z-50">
          <UserProfile
            username={user.username}
            onProfileClick={openProfile}
            onEditClick={openProfile}
          // onLogout={handleLogout}
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
              className={`rounded-lg px-4 py-2 font-medium transition-all ${filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${filter === 'active'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${filter === 'completed'
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