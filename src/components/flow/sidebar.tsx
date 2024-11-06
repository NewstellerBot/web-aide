export default function Sidebar() {
  return (
    <div className="w-80 border-r p-3">
      <div
        draggable
        onDrag={() => console.log("dragging")}
        className="rounded-lg px-2 py-0.5 hover:cursor-grab hover:bg-slate-50 active:cursor-grabbing"
      >
        Prompt Node
      </div>
    </div>
  );
}
