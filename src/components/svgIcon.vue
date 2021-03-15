<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{color: color}">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>

import { defineProps, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  console.log(props.name, 'props.name')
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return 'svg-icon'
})
</script>

<style>
    .svg-icon {
        width: 1em;
        height: 1em;
        font-size: 1.2em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
