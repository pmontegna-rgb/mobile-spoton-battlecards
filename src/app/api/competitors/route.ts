import { NextResponse } from 'next/server';
import { BattlecardData } from '@/data/competitors';
import { getAllCompetitorsFromSheet, saveCompetitorToSheet } from '@/lib/google-sheets';

export async function GET() {
    try {
        const competitors = await getAllCompetitorsFromSheet();
        return NextResponse.json(competitors);
    } catch (error) {
        console.error("Error reading from Google Sheets", error);
        return NextResponse.json({ error: "Failed to read competitors data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newCompetitor: BattlecardData = await request.json();
        await saveCompetitorToSheet(newCompetitor);
        return NextResponse.json(newCompetitor, { status: 201 });
    } catch (error) {
        console.error("Error writing to Google Sheets", error);
        return NextResponse.json({ error: "Failed to save competitor data" }, { status: 500 });
    }
}
