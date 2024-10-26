<template>
  <div>
    <h1>Infinitimeline test</h1>
    <h2>Timeline with data array <button @click="addToArray">Add item</button></h2>
    <div style="width: 80%; margin: 0 auto; height: 230px; border: 1px solid;">
      <InfiniTimeline :data-array="data" :logging="true" css-text-color="red" title-format="text" />
    </div>
    <h2>Timeline with supplier <button @click="addToSupplier">Add item</button></h2>
    <div style="width: 80%; margin: 0 auto; height: 230px; border: 1px solid;">
      <InfiniTimeline :data-supplier="supplier" :logging="true" css-text-color="blue" title-format="date" 
      :images="true" blank-image="/vue-logo.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import InfiniTimeline from '../lib/InfiniTimeline.vue'
import type { InfiniTimelineItem, InfiniTimelineSupplier } from '../lib/main.ts'

const data = ref([] as InfiniTimelineItem[])
for (let id = 1; id <= 100; id++) {
  data.value.push({ id, title: new Date().toISOString(), titleFormat: 'text', titleDateFormat: 'DD.MM.YYYY HH:mm:ss', content: 'Event no.' + id, tooltip: 'More info about event', imageSrc: id % 5 === 0 ? '/nuxt-logo.png' : undefined })
}
const supplier: Ref<InfiniTimelineSupplier> = ref({
  getTotal() {
    return data.value.length
  },
  get(startIndex: number, chunkSize: number) {
    return data.value.slice(startIndex, startIndex + chunkSize)
  }
})

function addToArray() {
  data.value.unshift({ id: data.value.length + 1, title: new Date().toISOString(), titleFormat: 'text', titleDateFormat: 'DD.MM.YYYY HH:mm:ss', content: 'New event', tooltip: 'Manually added', imageSrc: '/nuxt-logo.png' })
}

function addToSupplier() {
  addToArray()
  supplier.value.changes = true
}
</script>
