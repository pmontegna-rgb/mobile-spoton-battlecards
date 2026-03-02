"use client";

import { useEffect, useState } from 'react';
import { BattlecardData } from '@/data/competitors';
import Link from 'next/link';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function AdminDashboard() {
    const [competitors, setCompetitors] = useState<BattlecardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/competitors')
            .then(res => res.json())
            .then(data => {
                setCompetitors(data);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        const res = await fetch(`/api/competitors/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setCompetitors(prev => prev.filter(c => c.id !== id));
        } else {
            alert("Failed to delete competitor");
        }
    };

    const handleReorder = (newItems: BattlecardData[]) => {
        // Merge the updated subset back into the master competitors list
        setCompetitors(prev => {
            const untouched = prev.filter(p => !newItems.find(ni => ni.id === p.id));
            return [...untouched, ...newItems]; // the subsets are internally sorted, but AdminDashboard relies on API to return fully sorted anyways
        });
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="text-slate-400 animate-pulse text-lg font-medium">Loading competitors...</div>
        </div>
    );

    // Initial server fetch is presorted by getSortedCompetitors, so we just filter
    const expressCompetitors = competitors.filter(c => c.productType === 'Express').sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    const rposCompetitors = competitors.filter(c => c.productType === 'RPOS').sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-white mb-2">Competitor Dashboard</h1>
                <p className="text-slate-400">Manage battlecard data including pain points, starters, strengths, and objection handling for Express and RPOS competitors. Drag and drop to reorder.</p>
            </div>

            <CompetitorList title="Express" data={expressCompetitors} onDelete={handleDelete} onReorder={handleReorder} />
            <CompetitorList title="RPOS" data={rposCompetitors} onDelete={handleDelete} onReorder={handleReorder} />
        </div>
    );
}

function CompetitorList({ title, data, onDelete, onReorder }: { title: string, data: BattlecardData[], onDelete: (id: string, name: string) => void, onReorder: (newOrder: BattlecardData[]) => void }) {
    const [items, setItems] = useState(data);

    useEffect(() => {
        setItems(data);
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);

            // Optimistically update
            setItems(newItems);

            // Reorder properties locally
            const orderedItems = newItems.map((item, index) => ({ ...item, order: index }));

            // Dispatch reorder payload
            const payload = orderedItems.map(item => ({ id: item.id, order: item.order }));
            fetch('/api/competitors/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                onReorder(orderedItems);
            });
        }
    };

    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
                <Link href={`/admin/competitor/new?type=${title === 'Express' ? 'Express' : 'RPOS'}`} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add {title}
                </Link>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-800/50">
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map(comp => <SortableItem key={comp.id} comp={comp} onDelete={onDelete} />)}
                            {items.length === 0 && (
                                <div className="p-8 text-center text-slate-500 bg-slate-900/50">No competitors configured yet.</div>
                            )}
                        </SortableContext>
                    </div>
                </div>
            </DndContext>
        </div>
    );
}

function SortableItem({ comp, onDelete }: { comp: BattlecardData, onDelete: (id: string, name: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: comp.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={`p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors gap-4 bg-slate-900 ${isDragging ? 'shadow-lg border border-indigo-500 rounded-lg' : 'hover:bg-slate-800/80'}`}>
            <div className="flex items-center gap-4">
                <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-2 -ml-2 rounded-lg touch-none">
                    <GripVertical className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-lg font-bold text-slate-200">{comp.name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{comp.sections?.length || 0} Sections</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{comp.sections?.reduce((acc, s) => acc + s.items.length, 0) || 0} Total Items</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 opacity-100">
                <Link href={`/admin/competitor/${comp.id}`} className="flex-1 sm:flex-none justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                </Link>
                <button onClick={() => onDelete(comp.id, comp.name)} className="flex-1 sm:flex-none justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
            </div>
        </div>
    );
}
