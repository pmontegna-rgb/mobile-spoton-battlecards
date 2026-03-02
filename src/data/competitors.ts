
export type FieldDefinition = {
    key: string;
    label: string;
    multiline?: boolean;
};

export type BattlecardSection = {
    id: string;
    title: string;
    type: "string-array" | "object-array";
    fields?: FieldDefinition[];
    items: (string | Record<string, string>)[];
};

export type BattlecardData = {
    id: string;
    name: string;
    logoUrl?: string;
    productType: "Express" | "RPOS";
    order?: number;
    sections: BattlecardSection[];
};



