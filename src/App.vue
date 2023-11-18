<template>
  <div style="width: 80%; margin: 0 auto; height: 250px; border: 1px solid;">
    <InfiniTimeline :data-supplier="supplier" :logging="true" css-text-color="blue" title-format="date"/>
  </div>
</template>

<script setup lang="ts">
import InfiniTimeline from '../lib/InfiniTimeline.vue'
import type { InfiniTimelineItem } from '../lib/main.ts'

const data = [] as InfiniTimelineItem[]
for (let id = 1; id <= 100; id++) {
  data.push({ id, title: new Date().toISOString(), titleFormat: 'text', titleDateFormat: 'DD.MM.YYYY HH:mm:ss', content: 'Event no.' + id, tooltip: 'More info about event' })
}
const supplier = {
  getTotal() {
    return data.length
  },
  get(startIndex: number, chunkSize: number) {
    return data.slice(startIndex, startIndex + chunkSize)
  }
}
</script>
