<template>
  <div ref="timeline" class="timeline-wrapper">
    <div v-for="(item, index) in timelineData" :key="item.id" class="timeline-slot" :title="item.tooltip">
      <div v-if="isOdd(index) && !narrowScreen" class="timeline-padding" />
      <div v-if="isOdd(index) || narrowScreen" class="timeline-axis" />
      <div class="timeline-item" :class="isOdd(index) || narrowScreen ? 'timeline-item-right' : 'timeline-item-left'">
        <div v-if="isOdd(index) || narrowScreen" class="timeline-pointer" style="margin-left: -8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
            <path d="M17.215 8.68c1.047.568 1.047 2.07 0 2.638l-11.999 6.5a1.5 1.5 0 0 1-2.214-1.32V3.5a1.5 1.5 0 0 1 2.214-1.32l11.999 6.5Z"/>
          </svg>
        </div>
        <div class="timeline-data">
          <div class="timeline-item-title">
            {{ titleAsDateOrText(item) }}
          </div>
          <div class="timeline-item-content">
            {{ item.content }}
          </div>
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
import { time } from 'console';

export interface Props {
  chunkSize?: number,
  dataArray?: InfiniTimelineItem[], 
  dataSupplier?: InfiniTimelineSupplier,
  logging?: boolean,
  cssBgColor?: string,
  cssTextColor?: string,
  titleFormat?: string,
  titleDateFormat?: string,
}

const props = withDefaults(defineProps<Props>(), {
  chunkSize: 10,
  logging: false,
  cssBgColor: 'transparent',
  cssTextColor: 'black',
  titleFormat: 'text',
  titleDateFormat: 'YYYY-MM-DD'
})

// template ref to HTML container
const timeline = ref(null)

// data array
const timelineData = ref([] as InfiniTimelineItem[])

// prerequisities check
onBeforeMount(() => {
  if (!props.dataArray && !props.dataSupplier) {
    throw new Error("InfiniTimeline error: Either `dataArray` or `dataSupplier` must be provided'")
  } 
})

// reset + load initial batch of data
onMounted(() => {
  timelineData.value = []
  getMoreData(0, props.chunkSize)
})

// define VueUse infinite scroll
useInfiniteScroll(
  timeline,
  () => {
    timelineData.value.push(...getMoreData(timelineData.value.length, props.chunkSize))
  },
  {
    distance: props.chunkSize,
    throttle: 100,
    canLoadMore: (timeline) => moreDataAvailableInDataArray() || moreDataAvailableInDataSupplier()
  }
)

function getMoreData (start: number, batch: number) {
  logIfWanted('loading more data...')
  if (moreDataAvailableInDataArray()) {
    return props.dataArray!.slice(start, start + batch)
  } else if (moreDataAvailableInDataSupplier()) {
    return props.dataSupplier!.get(start, batch)
  }
  return []
}

function moreDataAvailableInDataArray() {
  return !!props.dataArray && timelineData.value.length < props.dataArray.length
}
function moreDataAvailableInDataSupplier() {
  return !!props.dataSupplier && timelineData.value.length < props.dataSupplier.getTotal()
}

// only log messages when requested via a prop
function logIfWanted(message: string) {
  if (props.logging) {
    console.debug(message)
  }
}

// controlling displaying left/right elements
const isOdd = (i: number) => i % 2 === 1
const isEven = (i: number) => !isOdd(i)

// when width < 640, only display items in one column
const { width } = useWindowSize()
const narrowScreen = computed(() => Math.ceil(width.value) <= 640)

// format title as date if requested, otherwise return title as it is
// settings from `item` are evaluated first
// if nothing provided, component props are being used
function titleAsDateOrText(item: InfiniTimelineItem): string {
  if (item?.titleFormat === 'date' || props.titleFormat === 'date') {
    const format = item?.titleDateFormat || props.titleDateFormat
    return useDateFormat(item?.title, format).value
  } else {
    return item?.title
  }
}

// reset view upon changes in provided data array
watch(() => props.dataArray, () => {
  logIfWanted('provided dataArray changed - reseting timeline')
  timelineData.value.length = 0
  timelineData.value.push(...getMoreData(0, props.chunkSize))
  const timelineDiv = timeline.value! as HTMLElement
  timelineDiv.scroll({ top:0 })
}, { deep: true })
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
