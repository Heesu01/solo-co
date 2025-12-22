<template>
  <GoogleMap
    :center="center"
    :markers="markers"
    :search-markers="searchMarkers"
    :active-id="activeId"
    :active-search-id="activeSearchId"
    @ready="$emit('ready', $event)"
    @markerClick="$emit('markerClick', $event)"
    @searchMarkerClick="$emit('searchMarkerClick', $event)"
  />
</template>

<script setup>
import GoogleMap from '@/components/travel/GoogleMapItinerary.vue'

defineProps({
  center: { type: Object, default: () => ({ lat: 37.5665, lng: 126.978 }) },

  markers: { type: Array, default: () => [] },

  searchMarkers: { type: Array, default: () => [] },

  activeId: { type: [String, Number], default: null },

  activeSearchId: { type: [String, Number], default: null },
})

defineEmits(['ready', 'markerClick', 'searchMarkerClick'])
</script>
