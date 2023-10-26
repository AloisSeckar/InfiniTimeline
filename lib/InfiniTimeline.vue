<template>
  <div ref="timeline" class="timeline-wrapper">
    <div v-for="(item, index) in timelineData" :key="item.id" class="timeline-slot" :title="item.tooltip">
      <div v-if="isOdd(index)" class="timeline-padding" />
      <div v-if="isOdd(index)" class="timeline-axis" />
      <div class="timeline-item" :class="isEven(index) ? 'timeline-item-left' : 'timeline-item-right'">
        <div v-if="isOdd(index)" class="timeline-pointer" style="margin-left: -8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
            <path d="M17.215 8.68c1.047.568 1.047 2.07 0 2.638l-11.999 6.5a1.5 1.5 0 0 1-2.214-1.32V3.5a1.5 1.5 0 0 1 2.214-1.32l11.999 6.5Z"/>
          </svg>
        </div>
        <div class="timeline-data">
          <div class="timeline-item-title">
            {{ item.title }}
          </div>
          <div class="timeline-item-content">
            {{ item.content }}
          </div>
        </div>
        <div v-if="isEven(index)" class="timeline-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
            <path d="M2.786 8.68a1.5 1.5 0 0 0 0 2.638l11.998 6.5A1.5 1.5 0 0 0 17 16.498V3.5a1.5 1.5 0 0 0-2.215-1.32L2.786 8.68Z"/>
          </svg>
        </div>
      </div>
      <div v-if="isEven(index)" class="timeline-axis" />
      <div v-if="isEven(index)" class="timeline-padding" />
    </div> 
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import type { InfiniTimelineItem, InfiniTimelineSupplier } from './it-types'

export interface Props {
  chunkSize?: number,
  dataArray?: InfiniTimelineItem[], 
  dataSupplier?: InfiniTimelineSupplier,
  logging?: boolean,
  cssBgColor?: string,
  cssTextColor?: string,
}

const props = withDefaults(defineProps<Props>(), {
  chunkSize: 10,
  logging: false,
  cssBgColor: 'transparent',
  cssTextColor: 'black'
})

// template ref to HTML container
const timeline = ref(null)

// data array
const timelineData = ref([] as InfiniTimelineItem[])

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
    throttle: 100
  }
)

function getMoreData (start: number, batch: number) {
  logIfWanted('loading more data...')
  if (props.dataArray) {
    if (timelineData.value.length < props.dataArray.length) {
      return props.dataArray.slice(start, start + batch)
    }
  } else if (props.dataSupplier) {
    if (timelineData.value.length < props.dataSupplier.getTotal()) {
      return props.dataSupplier.get(start, batch)
    }
  } else {
    throw new Error("InfiniTimeline error: Either `dataArray` or `dataSupplier` must be provided'")
  }
  return []
}

function logIfWanted(message: string) {
  if (props.logging) {
    console.debug(message)
  }
}

const isOdd = (i: number) => i % 2 === 1
const isEven = (i: number) => !isOdd(i)
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
