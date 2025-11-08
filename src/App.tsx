import React, { useRef, useState } from "react";

interface Task {
  id: string | number;
  content: string;
}
function App() {
  const [items, setItems] = useState<Task[]>([{ id: 1, content: "project" }]);
  const [newTask, setNewTask] = useState("");
  const draggedIndex = useRef<number | null>(null);
  const draggedOverIndex = useRef<number | null>(null);

  const addTask = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(),
        content: newTask,
      },
    ]);
    setNewTask("");
  };

  const removeTask = (taskId: number | string) => {
    setItems((prevItems) => prevItems.filter((items) => items.id !== taskId));
  };

  const handleDragStart = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    draggedIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text", index.toString());
  };

  const handleDragEnd = () => {
    draggedIndex.current = null;
    draggedOverIndex.current = null;
  };

  const handleDragOver = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    draggedOverIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const from = draggedIndex.current;
    const to = draggedOverIndex.current;
    if (from === null || to === null || from === to) return;
    setItems((prevItems) => {
      const copy = [...prevItems];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    draggedIndex.current = null;
    draggedOverIndex.current = null;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-zinc-900 to-zinc-800 w-full flex justify-center items-center flex-col">
      <h1 className="text-5xl sm:text-6xl bg-gradient-to-r from-yellow-600 via-amber-500 to-rose-400 font-bold bg-clip-text text-transparent text-center mb-7">
        Drag and Drop
      </h1>
      <div className="mb-8 flex w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter your task here..."
          className="bg-zinc-700 text-white flex-grow p-3"
        />
        <button
          className="px-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-500 transition-all duration-200 cursor-pointer"
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2 ">
        {items.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => handleDragStart(idx, e)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(idx, e)}
            onDrop={handleDrop}
            className="m-4 mb-3 bg-zinc-800 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition duration-300  hover:shadow-lg p-3"
          >
            <span>{item.content}</span>
            <button
              className="text-zinc-400 hover:text-red-400 w-6 h-6 flex justify-center items-center transition duration-300 hover:bg-zinc-600"
              onClick={() => removeTask(item.id)}
            >
              <span className="text-lg cursor-pointer">x</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
