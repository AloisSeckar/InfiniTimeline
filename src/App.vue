<template>
  <div>
    <h1>Infinitimeline test</h1>
    <h2>Timeline with data array</h2>
    <div style="width: 80%; margin: 0 auto; height: 230px; border: 1px solid;">
      <InfiniTimeline :data-array="data" :logging="true" css-text-color="red" title-format="text"/>
    </div>
    <h2>Timeline with supplier</h2>
    <div style="width: 80%; margin: 0 auto; height: 230px; border: 1px solid;">
      <InfiniTimeline :data-supplier="supplier" :logging="true" css-text-color="blue" title-format="date"/>
    </div>
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
