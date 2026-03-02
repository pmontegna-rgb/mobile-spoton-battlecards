import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { BattlecardData } from '@/data/competitors';

// Load credentials (checks file first, then environment variable for Vercel)
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');
let credentials: { client_email?: string, private_key?: string } = {};

if (fs.existsSync(CREDENTIALS_PATH)) {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
        console.error("Error parsing GOOGLE_SERVICE_ACCOUNT_JSON:", e);
    }
}

// Authenticate via JWT
const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

export async function getGoogleSheet() {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
}

export async function getCompetitorsSheet() {
    const doc = await getGoogleSheet();
    let sheet = doc.sheetsByTitle['Competitors'];

    // If the sheet doesn't exist, create it with our headers
    if (!sheet) {
        sheet = await doc.addSheet({
            title: 'Competitors',
            headerValues: ['id', 'name', 'productType', 'order', 'logoUrl', 'sections_json'],
        });

        // Let's do a one-time migration from local file if available
        await performOneTimeMigration(sheet);
    }

    return sheet;
}

async function performOneTimeMigration(sheet: GoogleSpreadsheetWorksheet) {
    const LOCAL_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'competitors.json');
    if (fs.existsSync(LOCAL_DATA_PATH)) {
        console.log("Found local competitors.json. Migrating data to Google Sheets...");
        const rawData = fs.readFileSync(LOCAL_DATA_PATH, 'utf8');
        const localCompetitors: BattlecardData[] = JSON.parse(rawData);

        const rowsToAdd = localCompetitors.map(comp => ({
            id: comp.id,
            name: comp.name,
            productType: comp.productType,
            order: comp.order ?? 99,
            logoUrl: comp.logoUrl || '',
            sections_json: JSON.stringify(comp.sections || [])
        }));

        if (rowsToAdd.length > 0) {
            await sheet.addRows(rowsToAdd);
            console.log(`Migrated ${rowsToAdd.length} competitors to Google Sheets.`);
        }
    }
}

export async function getAllCompetitorsFromSheet(): Promise<BattlecardData[]> {
    try {
        const sheet = await getCompetitorsSheet();
        const rows = await sheet.getRows();

        const competitors: BattlecardData[] = rows.map(row => {
            return {
                id: row.get('id'),
                name: row.get('name'),
                productType: row.get('productType') as "Express" | "RPOS",
                order: row.get('order') ? parseInt(row.get('order'), 10) : undefined,
                logoUrl: row.get('logoUrl'),
                sections: row.get('sections_json') ? JSON.parse(row.get('sections_json')) : [],
            };
        });

        // Sort them just in case
        return competitors.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    } catch (error) {
        console.error("Error reading from Google Sheets:", error);
        return [];
    }
}

export async function saveCompetitorToSheet(data: BattlecardData) {
    const sheet = await getCompetitorsSheet();
    const rows = await sheet.getRows();
    const existingRow = rows.find(r => r.get('id') === data.id);

    const rowData = {
        id: data.id,
        name: data.name,
        productType: data.productType,
        order: data.order ?? 99,
        logoUrl: data.logoUrl || '',
        sections_json: JSON.stringify(data.sections || []),
    };

    if (existingRow) {
        existingRow.assign(rowData);
        await existingRow.save();
    } else {
        await sheet.addRow(rowData);
    }
}

export async function deleteCompetitorFromSheet(id: string) {
    const sheet = await getCompetitorsSheet();
    const rows = await sheet.getRows();
    const existingRow = rows.find(r => r.get('id') === id);

    if (existingRow) {
        await existingRow.delete();
    }
}

export async function batchUpdateCompetitorOrdersInSheet(payload: { id: string, order: number }[]) {
    const sheet = await getCompetitorsSheet();
    const rows = await sheet.getRows();

    const orderMap = new Map(payload.map(p => [p.id, p.order]));

    for (const row of rows) {
        const id = row.get('id');
        if (id && orderMap.has(id)) {
            row.set('order', orderMap.get(id)!);
            await row.save();
        }
    }
}
