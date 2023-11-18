export type InfiniTimelineItem = {
    // unique identifier used as the `key` attribute for inner `v-for` cycle
    id: number,
    // text displayed in first row (usually meant to be a date of an event)       
    title: string,
    // allows to pick between plain text and JS Date representation of the title (defaults to 'text')
    titleFormat?: 'text' | 'date',
    // formatting options, if `titleFormat='date'` is selected (defaults to 'YYYY-MM-DD')
    // see https://vueuse.org/shared/useDateFormat/ for allowed options
    titleDateFormat?: string,
    // text displayed in second row (description of an event)
    content: string,
    // potential "tooltip" text displayed upon mouse hovering over given data entry
    tooltip?: string
}

export interface InfiniTimelineSupplier {
    // return the maximum number of items that are possible to be fetched
    getTotal(): number,
    // fetch a next batch of items
    get(startIndex: number, chunkSize: number): InfiniTimelineItem[]
}
