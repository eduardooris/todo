import './App.css'
import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState("")
  const [time, setTime] = useState(0)
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  // Load todos on page load

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + '/todos')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoading(false)

      setTodos(res)
    }

    loadData()
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }


    // Envio para API
    await fetch(API + '/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos((prevState) => [...prevState, todo])


    setTitle('')
    setTime()
  }

  const handleDelete = async (id) => {
    await fetch(API + '/todos' + id, {
      method: "DELETE",
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async (todo) => {
    
    todo.done = !todo.done

    const data = await fetch(API + '/todos' + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type" : "application/json",
      }
    })
    
    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
  }
  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>
      {/* Header */}
      <div className='form-todo'>
        <h2>Insira sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer ?</label>
            <input type="text" name='title' placeholder='Título da tarefa' value={title || ""} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          {/* Titulo */}
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input type="number" name='time' placeholder='Tempo Estimado (em horas)' value={time || ""} onChange={(e) => setTime(e.target.value)} required />
          </div>
          {/* Tempo */}
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      {/* Form */}
      <div className='list-todo'>
        <h2>Lista de tarefas
          {todos.length === 0 && <p>Não há tarefas!</p>}
        </h2>
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time} <strong>Horas</strong></p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
