export interface Organization {
    id: string
    name: string
    owner_id: string
    created_at: string
    updated_at: string
}

export interface Board {
    id: string
    title: string
    description?: string
    org_id: string
    creator_id: string
    creator_name?: string
    created_at: string
    updated_at: string
}