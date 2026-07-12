

// import { useState, useRef } from 'react'

// interface TodoInputProps {
//   onAdd: (title :string,description: string , status : string , priority : string , due_date : Date) => void
// }

// export default function TodoInput({ onAdd }: TodoInputProps) {
//   const [value, setValue] = useState('')
//   const inputRef = useRef<HTMLInputElement>(null)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (value.trim()) {
//       // onAdd(value.trim())
//       onAdd(
//     value.trim(),
//     "default description",
//     "pending",
//     "low",
//     new Date()
//   );
//       setValue('')
//       inputRef.current?.focus()
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="relative">
//       <div className="flex gap-2">
//         <input
//           ref={inputRef}
//           type="text"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder="Add a new task..."
//           // className="flex-1 rounded-xl border-2 border-border bg-card px-5 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//           className="flex-1 rounded-xl border-2 border-border bg-card px-5 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-[#c45349]/20"
//         />
        // <button
        //   type="submit"
        //   disabled={!value.trim()}
        //   className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        // >
        //   <svg
        //     className="w-5 h-5"
        //     fill="none"
        //     stroke="currentColor"
        //     viewBox="0 0 24 24"
        //   >
        //     <path
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       strokeWidth={2}
        //       d="M12 5v14m7-7H5"
        //     />
        //   </svg>
        // </button>
//       </div>
//     </form>
//   )
// }


import { useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';

interface TodoInputProps {
  onAdd: (
    title: string,
    description: string,
    status: string,
    priority: string,
    due_date: Date
  ) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error , setError] = useState("") ;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    due_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!formData.title.trim()) return;
    // onAdd(
    //   formData.title,
    //   formData.description,
    //   formData.status,
    //   formData.priority,
    //   new Date(formData.due_date)
    // );
  if (!formData.title.trim()) {
    return toast.error("Titile is required...!");
  }

  if (!formData.description.trim()) {
    return toast.error("Description is required");
  }

  // if (!formData.status) {
  //   return setError("Status is required");
  // }

  // if (!formData.priority) {
  //   return setError("Priority is required");
  // }

  if (!formData.due_date) {
    return toast.error("Due date is required");
  }

  const dueDate = new Date(formData.due_date);

  if (isNaN(dueDate.getTime())) {
    return toast.error("Invalid due date");
  }

   onAdd(
    formData.title.trim(),
    formData.description.trim(),
    formData.status,
    formData.priority,
    dueDate
  );

  setError('');
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "low",
      due_date: "",
    });
    toast.success('Your Task has been saved !') ;
    inputRef.current?.focus();
  };

  return (
    <>
    <Toaster position="top-right"
  reverseOrder={false} />
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        ref={inputRef}
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title..."
        className="w-full rounded-xl border px-5 py-3"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description..."
        className="w-full rounded-xl border px-5 py-3"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full rounded-xl border px-5 py-3"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full rounded-xl border px-5 py-3"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        className="w-full rounded-xl border px-5 py-3"
      />
      {error}

      {/* <button
        type="submit"
        className="rounded-xl bg-primary px-6 py-3 text-white"
      >
        Add Todo
      </button> */}
              <button
          type="submit"
          // disabled={!value.trim()}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
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
              d="M12 5v14m7-7H5"
            />
          </svg>
        </button>
    </form>
    </>
  );
}