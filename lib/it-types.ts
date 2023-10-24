export type InfiniTimelineItem = {
    // unique identifier used as the `key` attribute for inner `v-for` cycle
    id: number,
    // text displayed in first row (usually meant to be a date of an event)       
    title: string,
    // text displayed in second row (description of an event)
    content: string,
    // potential "tooltip" text displayed upon mouse hovering over given data entry
    tooltip?: string
}
export interface InfiniTimelineSupplier {
    total: number,
    get(startIndex: number, chunkSize: number): InfiniTimelineItem[]
}
