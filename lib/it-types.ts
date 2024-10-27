/**
 * Data item representing one record in the timeline.
 */
export type InfiniTimelineItem = {
    /**
     * Unique identifier used as the `key` attribute for inner `v-for` cycle.
     */
    id: number,

    /**
     * Text displayed in the first row (usually meant to be a date of an event).
     */   
    title: string,

    /**
     * Allows picking up between plain text and JS Date representation of the title (defaults to 'text').
     */
    titleFormat?: 'text' | 'date',

    /**
     * Formatting options, if `titleFormat='date'` is selected (defaults to 'YYYY-MM-DD').
     * See https://vueuse.org/shared/useDateFormat/ for allowed options.
    */
    titleDateFormat?: string,

    /**
     * Text displayed in the second row (description of an event).
     */
    content: string,

    /**
     * Potential "tooltip" text displayed upon mouse hovering over given data entry.
     */
    tooltip?: string

    /**
     * Potential image source to be displayed next to each item.
     */
    imageSrc?: string
}

/**
 * Supplier allowing "lazy" loading of data from an external source.
 */
export interface InfiniTimelineSupplier {
    /**
     * Returns the maximum number of items that can be fetched.
     */ 
    getTotal(): number,
    
    /**
     * Fetches the next batch of items
     * 
     * @param startIndex begining index of the next batch (+1 to currently last item)
     * @param chunkSize number of items (default 10, can be overriden)
     */
    get(startIndex: number, chunkSize: number): InfiniTimelineItem[],

    /**
     * Set to `true` if you changed the data and want to reload-them dynamically.
     * Internal watcher is monitoring this value and will trigger a reset.
     * NOTE: The dataSupplier has to be declared reactive, otherwise the watcher will not trigger!
     */
    changes?: boolean
}
