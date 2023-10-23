<template>
  <div ref="timeline" class="timeline-wrapper">
    <div v-for="(item, index) in timelineData" :key="item.id" :title="item.tooltip">
      <div class="timeline-item" :class="index % 2 === 0 ? 'left' : 'right'">
        <div class="timeline-item-title">
          {{ item.date }}
        </div>
        <div class="timeline-item-content">
          {{ item.title }}
        </div>
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

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

const props = defineProps<{
  chunkSize: number,
  dataArray?: InfiniTimelineItem[], 
  dataSupplier?: InfiniTimelineSupplier
}>()

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
  console.log('fired')
  if (props.dataArray) {
    if (timelineData.value.length < props.dataArray.length) {
      return props.dataArray.slice(start, start + batch)
    }
  } else if (props.dataSupplier) {
    if (timelineData.value.length < props.dataSupplier.total) {
      return props.dataSupplier.get(start, batch)
    }
  } else {
    throw new Error("InfiniTimeline error: Either `dataArray` or `dataSupplier` must be provided'")
  }
  return []
}
</script>

<style scoped>
.timeline-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.timeline-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
.timeline-wrapper {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.timeline-item {
    min-width: 250px;
    height: 60px;
    width: calc(50% - 2px);
    text-align: center;
    background-position-y: center;
    background-repeat: no-repeat;
    background-size: auto 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.left {
    margin-left: 0;
    margin-right: auto;
    border-right: 4px solid black;
    background-image: url('/left.svg');
    background-position-x: right;
}
.right {
    margin-right: 0;
    margin-left: auto;
    border-left: 4px solid black;
    background-image: url('/right.svg');
    background-position-x: left;
}

.timeline-item-title {
  font-weight: bold;
  font-size: 20px;
}
</style>
