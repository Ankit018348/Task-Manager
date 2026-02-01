import { useEffect, useState } from "react";
import { API } from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    API.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (!title) return;
    const res = await API.post("/tasks", { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };
  const toggleComplete = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";

    const res = await API.put(`/tasks/${task._id}`, {
      status: newStatus,
    });

    setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
  };

  const completed = tasks.filter((t) => t.status === "Completed").length;

  const progress =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-500">Welcome, ankit</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location = "/";
          }}
          className="border px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Stat label="Total" value={tasks.length} />
        <Stat label="Completed" value={completed} color="text-green-500" />
        <Stat
          label="Remaining"
          value={tasks.length - completed}
          color="text-blue-500"
        />
        <Stat label="Progress" value={`${progress}%`} />
      </div>
      <div className="flex gap-2 border rounded-lg p-4 mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 outline-none"
        />
        <button onClick={addTask} className="bg-black text-white px-4 rounded">
          +
        </button>
      </div>
      {tasks.map((task) => (
        <div
          key={task._id}
          className="border rounded-xl p-6 mb-4 flex flex-col items-center"
        >
          <button
            onClick={() => toggleComplete(task)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center mb-3
              ${
                task.status === "Completed"
                  ? "bg-gray-600 text-white"
                  : "border-gray-300"
              }`}
          >
            {task.status === "Completed" && "✓"}
          </button>
          <p
            className={`font-medium ${
              task.status === "Completed" ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </p>
          <button
            onClick={() => deleteTask(task._id)}
            className="text-red-500 mt-3"
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value, color = "text-black" }) {
  return (
    <div className="border rounded-xl p-6 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );
}
