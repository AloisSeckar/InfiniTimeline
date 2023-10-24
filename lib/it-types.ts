export type InfiniTimelineItem = {
    id: number,
    date: string,
    title: string,
    tooltip?: string
}
export interface InfiniTimelineSupplier {
    total: number,
    get(startIndex: number, chunkSize: number): InfiniTimelineItem[]
}
