import Prompt from "./prompt";

export default function Sidebar() {
    return (
        <div className="w-80 border-r p-3">
            <div className="mb-5">
                <h2 className="font-semibold tracking-tight">Nodes</h2>
                <p className="text-xs text-slate-600">
                    Drag and drop nodes, connect, and create powerfull flows.
                </p>
            </div>
            <Prompt type="default">Builtint</Prompt>
            <Prompt type="prompt">💬 LLM model</Prompt>
            <Prompt type="db">💿 Knowledgebase</Prompt>
        </div>
    );
}
