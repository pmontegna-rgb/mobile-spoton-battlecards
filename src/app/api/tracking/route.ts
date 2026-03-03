import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { logUsageEvent } from '@/lib/google-sheets';

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { path, event, metadata } = body;

        if (!path || !event) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await logUsageEvent({
            email: session.user.email,
            path,
            event,
            metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
