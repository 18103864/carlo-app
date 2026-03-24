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

export interface Section {
    id: string
    title: string
    sort_order: number
    board_id: string
    creator_id: string
    created_at: string
}

export interface Task {
    id: string
    title: string
    description?: string
    section_id: string
    sort_order: number
    creator_id: string
    creator_name?: string
    assignee_id?: string
    assignee_name?: string
    due_date?: string
    priority?: string
    created_at: string
    updated_at: string
}