![NPM](https://img.shields.io/npm/l/infinitimeline)
[![npm version](https://badge.fury.io/js/infinitimeline.svg)](https://badge.fury.io/js/infinitimeline)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg?style=flat)]()

<img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" /> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />

# InfiniTimeline
A [Vue 3](https://vuejs.org/) component for displaying provided collection of time-based events as a timeline with 'infinite' scrolling down powered by `useInfiniteScroll` from [VueUse](https://vueuse.org/).

For questions and bug reports visit project`s [GitHub repository](https://github.com/AloisSeckar/InfiniTimeline).

## About
This package will provide you with `<InfiniTimeline />` Vue 3 component. The component takes a [data source](#providing-data) and displays given data elements along the central top-down axis. On wider screens the data are displayed in two altering columns, on screens up to `640px` wide columns colapse into one. 

The component keeps loading more entries from the source as user scrolls down with a mouse until the data source is depleated (or the browser tab crashes).

It is possible to select, whether the entry `title` is just a plain text or if the values hold inside `title` represent JS date. This `titleFormat` option defaults to `'text'`. If `'date'` is requested, the output can be adjusted via `titleDateFormat` string. The formatting is made using [`useDateFormat`](https://vueuse.org/shared/useDateFormat/) function from VueUse. The format defaults to `YYYY-MM-DD`. Those settings can be fine-grained for each entry separately (see [Providing data](#providing-data)) or defined component-wide via props (see [Props reference](#props-reference))

### Providing data
Data elements are represented by a following object:
```js
type InfiniTimelineItem = {
  // unique identifier used as the `key` attribute for inner `v-for` cycle
  id: number,
  // text displayed in first row (usually meant to be a date of an event)       
  title: string,
  // allows to pick between plain text and JS Date representation of the title (defaults to 'text')
  titleFormat: 'text' | 'date',
  // formatting options, if `titleFormat='date'` is selected (defaults to 'YYYY-MM-DD')
  // see https://vueuse.org/shared/useDateFormat/ for allowed options
  titleDateFormat?: string,
  // text displayed in second row (description of an event)
  content: string,
  // potential "tooltip" text displayed upon mouse hovering over given data entry
  tooltip?: string
}
```

To supply the component with data you need to provide either a `data-array` or a `data-supplier` (see [props](#props-reference)). 

Stick with `data-array` if the number of entries to display is fixed and small. Usage is pretty straigtforward - build and array and pass it to the component. 

Creating `data-supplier` requires to implement following functions:
```js
export interface InfiniTimelineSupplier {
  // return the maximum number of items that are possible to be fetched
  getTotal(): number,
  // fetch a next batch of items
  get(startIndex: number, chunkSize: number): InfiniTimelineItem[]
}
```
This concept of "lazy" requires extra effort, but it may help reducing site traffic as the data are only loaded when really needed and required by the user. 

Ultimately the choice is yours, but you need to provide one or an error is raised during component initialization. If both variants are provided, `data-array` will be used and the supplier will be ignored.

Regardless the data source only an initial portion of data elements is displayed upon mounting the component. Its size can be adjusted by `chunk-size` prop. Further elements are being loaded and appended as user scrolls down. The browser native scroll is hidden by CSS, because it doesn't look good, but the component is scrollable with mousewheel or arrow keys when focused.

### Props reference
The component takes following props:
* `data-array` - pre-rendered array of `InfiniTimelineItem`. Use when the number of data entries is reasonably small.
* `data-supplier` - implementation of `InfiniTimelineSupplier` for "lazy" loading of data entries. Preffer when pre-loading all the instances in memory would hurt the performance.
* `chunk-size` - the number of entries to be initially loaded into scroll view area and then re-loaded each time as user scrolls down. Defaults to `10`.
* `logging` - setting to `true` will enable console debug logs to help you troubleshooting. Defaults to `false` and thus no debug logs. **If used, remember to disable again for production!**
* `css-bg-color` - allows you to customize background color for each data entry. Must be stringified CSS color expression. Defaults to `transparent`.
* `css-text-color` - allows you to customize text color for each data entry. By default this color also applies to central axis and the pointer icons. Must be stringified CSS color expression. Defaults to `black`.
* `title-format` - allows you pick whether the item's title will be displayed as plain text (`text`) or formatted as date (`date`). Defaults to `text`. Settings from individual items will override this override component-level default.
* `title-date-format` - allows you to specify the formatting string for item titles represented as `date`. Must be valid string for [`useDateFormat`](https://vueuse.org/shared/useDateFormat/). Defaults to `YYYY-MM-DD`. Settings from individual items will override this component-level default.

### CSS customization
Currently basic CSS styling (except background and text color) is built-in. Couple of CSS pre-sets to choose from via prop is planned in future versions.

To override default styles manually you can utilize the CSS class structure:
* The whole component is wrapped with a `timeline-wrapper` div
* Data element stack vertically and each resides exactly one row wrapped inside `timeline-slot` div
* Each row contains exactly one `timeline-item` div (50% wide) which is then altering between `timeline-item-left` and `timeline-item-right` class controlling its position on either side of the central axis
* For displaying the actual data each item has a `timeline-item-title` and `timeline-item-content` divs wrapped in `timeline-data` elemenent
* Central axis is represented by `timeline-axis` class which basically just fills the empty space between `timeline-item` and `timeline-separator` which is the empty space on the other side (both divs are little less than 50% wide)
* Pointer icons are made width `svg` elements (currenty hardcoded) that are wrapped inside `timeline-pointer` class
