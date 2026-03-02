import { NextResponse } from 'next/server';
import { BattlecardData } from '@/data/competitors';
import { deleteCompetitorFromSheet, saveCompetitorToSheet } from '@/lib/google-sheets';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        await context.params;
        const updatedCompetitor: BattlecardData = await request.json();

        await saveCompetitorToSheet(updatedCompetitor);
        return NextResponse.json(updatedCompetitor);
    } catch (error) {
        console.error("Error updating competitor", error);
        return NextResponse.json({ error: "Failed to update competitor" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        await deleteCompetitorFromSheet(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting competitor", error);
        return NextResponse.json({ error: "Failed to delete competitor" }, { status: 500 });
    }
}
