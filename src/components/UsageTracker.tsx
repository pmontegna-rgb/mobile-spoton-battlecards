'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function UsageTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Avoid double tracking on initial mount or same path
        if (pathname === lastTrackedPath.current) return;

        const trackPageView = async () => {
            try {
                await fetch('/api/tracking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        path: pathname,
                        event: 'PAGE_VIEW',
                    }),
                });
                lastTrackedPath.current = pathname;
            } catch (error) {
                console.error('Failed to track page view:', error);
            }
        };

        trackPageView();
    }, [pathname]);

    return null;
}
