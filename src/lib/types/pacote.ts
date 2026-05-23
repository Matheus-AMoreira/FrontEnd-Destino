export interface Pacote {
    id: number;
    name: string;
    description: string;
    staff_id: string; // Guid
    package_photo_id?: number | null;
    package_photos?: {
        id: number;
        name: string;
        storage_type: string;
        cover_photo: string;
        is_url: boolean;
        photos?: Array<{
            id: number;
            path: string;
            is_url: boolean;
            order: number;
        }>;
    };
    tag_ids?: string | null;
    offers: Array<{
        id: number;
        price: number;
        start_date: string;
        end_date: string;
        availability: number;
        status: string;
        is_available: boolean;
        hotel?: {
            id: number;
            name: string;
            address: string;
            daily_rate: number;
            cidade?: {
                id: number;
                name: string;
                estado?: {
                    id: number;
                    sigla: string;
                    name: string;
                };
            };
        };
        transporte?: {
            id: number;
            company: string;
            type: string;
            price: number;
        };
    }>;
    created_at?: string;
    updated_at?: string;
}
