<template>
  <div ref="timeline" class="timeline-wrapper">
    <div v-for="(item, index) in timelineData" :key="item.id" class="timeline-slot" :title="item.tooltip">
      <div v-if="index % 2 === 1" class="timeline-padding" />
      <div v-if="index % 2 === 1" class="timeline-axis" />
      <div class="timeline-item" :class="index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'">
        <div class="timeline-item-title">
          {{ item.title }}
        </div>
        <div class="timeline-item-content">
          {{ item.content }}
        </div>
      </div>
      <div v-if="index % 2 === 0" class="timeline-axis" />
      <div v-if="index % 2 === 0" class="timeline-padding" />
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
