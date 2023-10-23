<template>
  <div style="width: 80%; margin: 0 auto; height: 250px; border: 1px solid;">
    <InfiniTimeline :chunk-size="10" :data-array="data" />
  </div>
</template>

<script setup lang="ts">
import InfiniTimeline from '../lib/InfiniTimeline.vue'
import type { InfiniTimelineItem } from '../lib/InfiniTimeline.vue'

const data = [] as InfiniTimelineItem[]
for (let id = 1; id < 100; id++) {
  data.push({ id, date: '2023', title: 'First event', tooltip: 'More info about event' })
}
</script>
