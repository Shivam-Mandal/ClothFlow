import React, { useState } from "react";

// Single-file React component (JSX) for the Style Management page.
// Uses Tailwind CSS classes for styling. Drop into your React app and
// ensure Tailwind is configured.

export default function StyleManagement() {
    // Steps come from an array (can be dynamic, fetched, etc.)
    const [steps] = useState([
        "Step 1",
        "Step 2",
        "Step 3",
        "Step 4",
        "Step 5",
        "Step 6",
        "Step 7",
        "Step 8",
        // add or remove entries here to change the number of step columns
    ]);

    // Example initial styles (you can start this empty or load from API)
    const [styles, setStyles] = useState([
        {
            id: Date.now() + "-1",
            name: "Style 1",
            checks: steps.map((_) => true), // example: first style all true
        },
        {
            id: Date.now() + "-2",
            name: "Style 2",
            checks: steps.map((_) => false),
        },
    ]);

    // For creating a new style
    const [creating, setCreating] = useState(false);
    const [newStyleName, setNewStyleName] = useState("");

    const toggleCheckbox = (styleIndex, stepIndex) => {
        setStyles((prev) => {
            const copy = JSON.parse(JSON.stringify(prev));
            copy[styleIndex].checks[stepIndex] = !copy[styleIndex].checks[stepIndex];
            return copy;
        });
    };

    const addStyle = () => {
        if (!newStyleName.trim()) return;
        const newStyle = {
            id: Date.now().toString(),
            name: newStyleName.trim(),
            checks: steps.map(() => false),
        };
        setStyles((s) => [...s, newStyle]);
        setNewStyleName("");
        setCreating(false);
    };

    const removeStyle = (id) => {
        setStyles((s) => s.filter((st) => st.id !== id));
    };

    const saveAll = () => {
        // Replace this with API call to persist `styles` to backend
        console.log("Saving styles:", styles);
        alert("Styles saved (check console for payload)");
    };

    return (
        <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Style Management</h1>
                        <p className="text-gray-600 mt-1">Manage your style definitions and their step checklist</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {creating ? (
                            <div className="flex items-center gap-3">
                                <input
                                    value={newStyleName}
                                    onChange={(e) => setNewStyleName(e.target.value)}
                                    placeholder="Style name"
                                    className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                                <button
                                    onClick={addStyle}
                                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setCreating(false);
                                        setNewStyleName("");
                                    }}
                                    className="px-3 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setCreating(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Create new Style
                            </button>
                        )}
                    </div>
                </div>

                {/* Table container */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">Style Name</th>
                                    {steps.map((s, idx) => (
                                        <th key={s + idx} className="px-4 py-3 text-left">
                                            {s}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {styles.map((st, si) => (
                                    <tr key={st.id} className="border-t last:border-b">
                                        <td className="px-4 py-3 align-top w-48">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <div className="font-medium">{st.name}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {st.checks.map((chk, ci) => (
                                            <td key={ci} className="px-4 py-3 align-top text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={chk}
                                                    onChange={() => toggleCheckbox(si, ci)}
                                                    className="w-5 h-5"
                                                />
                                            </td>
                                        ))}

                                        <td className="px-4 py-3 align-top text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => removeStyle(st.id)}
                                                    className="px-2 py-1 text-sm border rounded text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {styles.length === 0 && (
                                    <tr>
                                        <td colSpan={2 + steps.length} className="px-4 py-6 text-center text-gray-500">
                                            No styles yet. Create a new style to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Save button */}
                    <div className="p-4 flex justify-end">
                        <button
                            onClick={saveAll}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Save
                        </button>
                    </div>
                </div>

                {/* Small hint area (right panel in your sketch can be replicated here) */}
                <div className="mt-4 text-sm text-gray-600">
                    Tip: The steps are generated from an array (`steps`). Add/remove step labels in the steps array to change columns.
                </div>
            </div>
      
    );
}
