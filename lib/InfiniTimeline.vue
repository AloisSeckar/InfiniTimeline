<template>
  <div ref="timeline" class="timeline-wrapper">
    <div v-for="(item, index) in timelineData" :key="item.id" class="timeline-slot">
      <div v-if="isOdd(index) && !narrowScreen" class="timeline-padding" />
      <div v-if="isOdd(index) || narrowScreen" class="timeline-axis" />
      <div class="timeline-item" :class="getCSS(index)" :title="item.tooltip">
        <div v-if="isOdd(index) || narrowScreen" class="timeline-pointer" style="margin-left: -8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
            <path d="M17.215 8.68c1.047.568 1.047 2.07 0 2.638l-11.999 6.5a1.5 1.5 0 0 1-2.214-1.32V3.5a1.5 1.5 0 0 1 2.214-1.32l11.999 6.5Z"/>
          </svg>
        </div>
        <div class="timeline-data">
          <img v-if="images && displayImage(item) && isEven(index)" class="timeline-image" :src="getImageSrc(item)" />
          <div class="timeline-content">
            <div class="timeline-content-title">
              {{ titleAsDateOrText(item) }}
            </div>
            <div class="timeline-content-text">
              {{ item.content }}
            </div>
          </div>
          <img v-if="images && displayImage(item) && isOdd(index)" class="timeline-image" :src="getImageSrc(item)" />
        </div>
        <div v-if="isEven(index) && !narrowScreen" class="timeline-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
            <path d="M2.786 8.68a1.5 1.5 0 0 0 0 2.638l11.998 6.5A1.5 1.5 0 0 0 17 16.498V3.5a1.5 1.5 0 0 0-2.215-1.32L2.786 8.68Z"/>
          </svg>
        </div>
      </div>
      <div v-if="isEven(index) && !narrowScreen" class="timeline-axis" />
      <div v-if="isEven(index) && !narrowScreen" class="timeline-padding" />
    </div> 
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useDateFormat, useInfiniteScroll, useWindowSize } from '@vueuse/core'
import type { InfiniTimelineItem, InfiniTimelineSupplier } from './it-types'

/**
 * Vue props accepted by InfiniTimeline component. 
 * See README.md for detailed description.
 */
export interface Props {
  chunkSize?: number,
  dataArray?: InfiniTimelineItem[], 
  dataSupplier?: InfiniTimelineSupplier,
  images?: boolean,
  blankImage?: string,
  logging?: boolean,
  cssBgColor?: string,
  cssTextColor?: string,
  titleFormat?: string,
  titleDateFormat?: string,
}

/**
 * Default setting for InfiniTimeline component if no overrides provided.
 */
const props = withDefaults(defineProps<Props>(), {
  chunkSize: 10,
  images: false,
  logging: false,
  cssBgColor: 'transparent',
  cssTextColor: 'black',
  titleFormat: 'text',
  titleDateFormat: 'YYYY-MM-DD'
})

/**
 * Template ref pointing to wrapping HTML container.
 */
// TODO update to Vue 3.5 syntax
const timeline = ref(null)

/**
 * Reactive array for data items displayed as timeline.
 */
const timelineData = ref([] as InfiniTimelineItem[])

// prerequisities check
onBeforeMount(() => {
  if (!props.dataArray && !props.dataSupplier) {
    throw new Error("InfiniTimeline error: Either `dataArray` or `dataSupplier` must be provided'")
  } 
})

// init timeline upon first start
onMounted(() => {
  resetTimeline()
})

// instance of VueUse infinite scroll
// https://vueuse.org/core/useInfiniteScroll
useInfiniteScroll(
  timeline,
  () => {
    timelineData.value.push(...getMoreData(timelineData.value.length, props.chunkSize))
  },
  {
    distance: props.chunkSize,
    throttle: 100,
    canLoadMore: () => moreDataAvailableInDataArray() || moreDataAvailableInDataSupplier()
  }
)

/**
 * Implementation of VueUse infinite scroll supply function.
 * The infinite scroll asks for more items automatically, when it detects the end of the content
 * is approaching to viewport.
 * 
 * @param start begining index of the next batch (+1 to currently last item)
 * @param batch number of items (default 10, can be overriden)
 * 
 * @returns array of InfiniTimelineItem or an empty array if there are no more available
 */
function getMoreData (start: number, batch: number): InfiniTimelineItem[] {
  logIfWanted('loading more data...')
  if (moreDataAvailableInDataArray()) {
    return props.dataArray!.slice(start, start + batch)
  } else if (moreDataAvailableInDataSupplier()) {
    return props.dataSupplier!.get(start, batch)
  }
  return []
}

/**
 * Checks, whether it is possible to load more items from the current data array.
 * 
 * @returns `true`, if there is at least 1 item that haven't been displayed yet
 */
function moreDataAvailableInDataArray(): boolean {
  return !!props.dataArray && timelineData.value.length < props.dataArray.length
}

/**
 * Checks, whether it is possible to load more items from the current data supplier.
 * 
 * @returns `true`, if there is at least 1 item that haven't been displayed yet
 */
function moreDataAvailableInDataSupplier(): boolean {
  return !!props.dataSupplier && timelineData.value.length < props.dataSupplier.getTotal()
}

/**
 * Logs given debug message, but only if logging is requested via a prop.
 * It is advised to use `logging = true` only during development and turn this setting off
 * for the production environment.
 * 
 * @param message message to be printed out with DEBUG level
 */
function logIfWanted(message: string) {
  if (props.logging) {
    console.debug(message)
  }
}

/**
 * Controls the left/right alignment of items inside the timeline.
 * 
 * @param ord order of current item in the list
 * 
 * @returns `true` for odd items (1., 3., 5., etc.)
 */
const isOdd = (ord: number) => ord % 2 === 1

/**
 * Controls the left/right alignment of items inside the timeline.
 * 
 * @param ord order of current item in the list
 * 
 * @returns `true` for even items (2., 4., 6., etc.)
 */
const isEven = (ord: number) => !isOdd(ord)


// get the current screen width via VueUse helper
const { width } = useWindowSize()

/**
 * Breakpoint betwen single and double column layout.
 * When `width < 640`, only display items in one column.
 * With`images = true` setting, the value must be increased to `width < 690`
 * to avoid layout shifts.
 */
const treshold = props.images ? 690 : 640;

/**
 * Will be set to `true` on screens smaller than current `treshold`.
 * This indicates single column layout.
 */
const narrowScreen = computed(() => Math.ceil(width.value) <= treshold)

/**
 * Format title as date if requested, otherwise return title as it is.
 * Settings from given `item` are evaluated first.
 * If nothing is provided, settings for the component will be used.
 */
function titleAsDateOrText(item: InfiniTimelineItem): string {
  if (item?.titleFormat === 'date' || props.titleFormat === 'date') {
    const format = item?.titleDateFormat || props.titleDateFormat
    return useDateFormat(item?.title, format).value
  } else {
    return item?.title
  }
}

/**
 * Returns image source from given `item` or component's default value
 * (path to an image or `undefined`).
 */
function getImageSrc(item: InfiniTimelineItem): string | undefined {
  return item?.imageSrc ? item?.imageSrc : props.blankImage
}

/**
 * Returns `true` if there is an image to be displayed for given `item`.
 */
function displayImage(item: InfiniTimelineItem): boolean {
  return !!getImageSrc(item)
}

/**
 * Returns CSS class names for given row in the timeline.
 * Item may be either left or right aligned and it may or may not contain an image.
 */
function getCSS(index: number): string {
  let cssClasses = ''

  if (isOdd(index) || narrowScreen) {
    cssClasses = 'timeline-item-right'
  } else {
    cssClasses = 'timeline-item-left'
  }

  if (props.images) {
    cssClasses += ' timeline-item-image'
  } else {
    cssClasses += ' timeline-item-blank'
  }
  
  return cssClasses
}

// reset view upon changes in provided data array
// NOTE: dataArray has to be declared reactive in parent!
watch(() => props.dataArray, () => {
  logIfWanted('provided dataArray changed - reseting timeline')
  resetTimeline()
}, { deep: true })

// reset view upon changes in provided data supplier
// `changes` must be toggled manually
// NOTE: dataSupplier has to be declared reactive in parent!
watch(() => props.dataSupplier?.changes, (newValue) => {
  if (newValue) {
    logIfWanted('provided dataSupplier changed - reseting timeline')
    resetTimeline()
    props.dataSupplier!.changes = false
  }
})

/**
 * Function to reset + load initial batch of data.
 * It also resets timeline scrolling to the top.
 */
function resetTimeline() {
  timelineData.value.length = 0
  timelineData.value.push(...getMoreData(0, props.chunkSize))
  const timelineDiv = timeline.value! as HTMLElement
  timelineDiv.scroll({ top:0 })
}
</script>

<style scoped src="./it-style.css" />
<style scoped>
.timeline-item {
  color: v-bind('props.cssTextColor');
  background-color: v-bind('props.cssBgColor');
}

.timeline-axis {
  background-color: v-bind('props.cssTextColor');
}
</style>
