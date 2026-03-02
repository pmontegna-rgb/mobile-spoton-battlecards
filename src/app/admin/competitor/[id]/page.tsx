"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { BattlecardData, BattlecardSection, FieldDefinition } from '@/data/competitors';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Settings, GripVertical } from 'lucide-react';

export default function EditCompetitor() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isNew = params.id === 'new';

    const [data, setData] = useState<BattlecardData | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isNew) {
            const type = searchParams.get('type') || 'Express';
            setTimeout(() => setData({
                id: '',
                name: '',
                productType: type as "Express" | "RPOS",
                sections: []
            }), 0);
        } else {
            fetch(`/api/competitors`)
                .then(res => res.json())
                .then((allData: BattlecardData[]) => {
                    const found = allData.find(c => c.id === params.id);
                    if (found) setData(found);
                    else router.push('/admin');
                });
        }
    }, [isNew, params.id, router, searchParams]);

    if (!data) return <div className="p-8 text-center text-slate-400">Loading editor...</div>;

    const handleSave = async () => {
        setSaving(true);
        try {
            const competitorToSave = { ...data };
            if (isNew && !competitorToSave.id) {
                competitorToSave.id = `${competitorToSave.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${competitorToSave.productType.toLowerCase()}`;
            }

            const url = isNew ? '/api/competitors' : `/api/competitors/${competitorToSave.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(competitorToSave)
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                alert('Failed to save');
            }
        } catch {
            alert('Error saving data');
        }
        setSaving(false);
    };

    const updateField = (field: keyof BattlecardData, value: unknown) => {
        setData(prev => prev ? { ...prev, [field]: value } as BattlecardData : prev);
    };

    const addSection = (type: "string-array" | "object-array") => {
        const newSection: BattlecardSection = {
            id: `section_${Date.now()}`,
            title: 'New Section',
            type,
            items: [],
            fields: type === "object-array" ? [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', multiline: true }] : undefined
        };
        updateField('sections', [...data.sections, newSection]);
    };

    const updateSection = (index: number, updatedSection: BattlecardSection) => {
        const newSections = [...data.sections];
        newSections[index] = updatedSection;
        updateField('sections', newSections);
    };

    const deleteSection = (index: number) => {
        if (confirm("Are you sure you want to delete this entire section?")) {
            const newSections = data.sections.filter((_, i) => i !== index);
            updateField('sections', newSections);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="flex items-center justify-between bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm sticky top-20 z-40">
                <div className="flex items-center space-x-4">
                    <Link href="/admin" className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {isNew ? 'New Competitor' : `Edit ${data.name}`}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Basic Info */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2">Basic Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Competitor Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                            value={data.name}
                            onChange={e => updateField('name', e.target.value)}
                            placeholder="e.g. Toast"
                        />
                    </div>
                    {isNew && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Product Type</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none font-medium"
                                value={data.productType}
                                onChange={e => updateField('productType', e.target.value)}
                            >
                                <option value="Express">Express</option>
                                <option value="RPOS">RPOS</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-6">
                {data.sections.map((section, idx) => (
                    <SectionEditor
                        key={idx}
                        section={section}
                        onChange={(s) => updateSection(idx, s)}
                        onDelete={() => deleteSection(idx)}
                    />
                ))}
            </div>

            {/* Add Section Buttons */}
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center space-y-4">
                <h3 className="text-lg font-medium text-slate-300">Add New Section</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => addSection('string-array')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors border border-slate-700 hover:border-slate-600"
                    >
                        <Plus className="w-4 h-4 mr-2 text-amber-500" />
                        Simple List (e.g. Starters)
                    </button>
                    <button
                        onClick={() => addSection('object-array')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors border border-slate-700 hover:border-slate-600"
                    >
                        <Plus className="w-4 h-4 mr-2 text-indigo-500" />
                        Complex List (e.g. Pain Points)
                    </button>
                </div>
            </div>
        </div>
    );
}

// Section Editor Component
function SectionEditor({ section, onChange, onDelete }: { section: BattlecardSection, onChange: (s: BattlecardSection) => void, onDelete: () => void }) {
    const [editingMeta, setEditingMeta] = useState(false);

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400 transition-colors" />
                    {editingMeta ? (
                        <input
                            type="text"
                            className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold"
                            value={section.title}
                            onChange={e => onChange({ ...section, title: e.target.value })}
                            onBlur={() => setEditingMeta(false)}
                            autoFocus
                        />
                    ) : (
                        <h2 className="text-xl font-bold text-slate-200 cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => setEditingMeta(true)}>
                            {section.title}
                        </h2>
                    )}
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 ml-2">
                        {section.type === 'string-array' ? 'Simple List' : 'Complex List'}
                    </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingMeta(!editingMeta)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                        <Settings className="w-4 h-4" />
                    </button>
                    <button onClick={onDelete} className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {editingMeta && section.type === "object-array" && (
                <div className="p-6 bg-slate-900/50 border-b border-slate-800 border-dashed space-y-4">
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configure Section Fields</h4>
                    <p className="text-xs text-slate-500">Define the schema for items in this complex list section.</p>
                    <div className="space-y-2">
                        {(section.fields || []).map((field, fIdx) => (
                            <div key={fIdx} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                                <input
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-300 text-sm"
                                    placeholder="Field Key (e.g. title)"
                                    value={field.key}
                                    onChange={e => {
                                        const newFields = [...(section.fields || [])];
                                        newFields[fIdx] = { ...newFields[fIdx], key: e.target.value };
                                        onChange({ ...section, fields: newFields });
                                    }}
                                />
                                <input
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-300 text-sm"
                                    placeholder="Display Label"
                                    value={field.label}
                                    onChange={e => {
                                        const newFields = [...(section.fields || [])];
                                        newFields[fIdx] = { ...newFields[fIdx], label: e.target.value };
                                        onChange({ ...section, fields: newFields });
                                    }}
                                />
                                <label className="flex items-center gap-2 text-xs text-slate-400 px-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-700 bg-slate-900"
                                        checked={field.multiline || false}
                                        onChange={e => {
                                            const newFields = [...(section.fields || [])];
                                            newFields[fIdx] = { ...newFields[fIdx], multiline: e.target.checked };
                                            onChange({ ...section, fields: newFields });
                                        }}
                                    />
                                    Multiline?
                                </label>
                                <button
                                    onClick={() => {
                                        const newFields = (section.fields || []).filter((_, i) => i !== fIdx);
                                        onChange({ ...section, fields: newFields });
                                    }}
                                    className="text-slate-500 hover:text-rose-500 p-1.5 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newFields = [...(section.fields || []), { key: `field_${Date.now()}`, label: 'New Field' }];
                                onChange({ ...section, fields: newFields });
                            }}
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 mt-2 block"
                        >
                            + Add Field
                        </button>
                    </div>
                </div>
            )}

            <div className="p-6">
                {section.type === 'string-array' ? (
                    <StringArrayItems
                        items={section.items as string[]}
                        onChange={items => onChange({ ...section, items })}
                    />
                ) : (
                    <ObjectArrayItems
                        items={section.items as Record<string, string>[]}
                        fields={section.fields || []}
                        onChange={items => onChange({ ...section, items })}
                    />
                )}
            </div>
        </div>
    );
}

function StringArrayItems({ items, onChange }: { items: string[], onChange: (items: string[]) => void }) {
    const handleAdd = () => onChange([...items, '']);
    const handleRemove = (index: number) => onChange(items.filter((_, i) => i !== index));
    const handleUpdate = (index: number, val: string) => {
        const newItems = [...items];
        newItems[index] = val;
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item: string, i: number) => (
                <div key={i} className="flex gap-2 items-start group">
                    <textarea
                        className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[60px]"
                        value={item}
                        onChange={e => handleUpdate(i, e.target.value)}
                        placeholder="Enter item text..."
                    />
                    <button onClick={() => handleRemove(i)} className="text-slate-500 hover:text-rose-500 p-2 opacity-50 group-hover:opacity-100 transition-all hover:bg-rose-500/10 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <button onClick={handleAdd} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg">
                <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
        </div>
    );
}

function ObjectArrayItems({ items, fields, onChange }: { items: Record<string, string>[], fields: FieldDefinition[], onChange: (items: Record<string, string>[]) => void }) {
    const handleAdd = () => {
        const newItem: Record<string, string> = {};
        fields.forEach(f => newItem[f.key] = '');
        onChange([...items, newItem]);
    };
    const handleRemove = (index: number) => onChange(items.filter((_, i) => i !== index));
    const handleUpdate = (index: number, key: string, val: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: val };
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item: Record<string, string>, i: number) => (
                <div key={i} className="flex gap-4 items-start bg-slate-950 p-4 rounded-lg border border-slate-800/50 relative group">
                    <div className="flex-grow space-y-4">
                        {fields.map(f => (
                            <div key={f.key} className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{f.label}</label>
                                {f.multiline ? (
                                    <textarea
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[80px]"
                                        value={item[f.key] || ''}
                                        onChange={e => handleUpdate(i, f.key, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        value={item[f.key] || ''}
                                        onChange={e => handleUpdate(i, f.key, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleRemove(i)} className="text-slate-500 hover:text-rose-500 p-2 opacity-50 group-hover:opacity-100 transition-all hover:bg-rose-500/10 rounded-lg mt-5">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <button onClick={handleAdd} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg">
                <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
        </div>
    );
}
