import { NextResponse } from 'next/server';
import { batchUpdateCompetitorOrdersInSheet } from '@/lib/google-sheets';

export async function POST(request: Request) {
    try {
        const payload: { id: string; order: number }[] = await request.json();
        await batchUpdateCompetitorOrdersInSheet(payload);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to reorder competitors" }, { status: 500 });
    }
}
