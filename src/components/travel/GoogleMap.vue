<template>
  <div ref="el" class="h-full w-full" />
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { loadGoogleMaps } from '@/utils/googleMapsLoader'

const props = defineProps({
  center: { type: Object, default: () => ({ lat: 37.5665, lng: 126.978 }) },
  zoom: { type: Number, default: 13 },

  // 저장 마커
  markers: { type: Array, default: () => [] },

  //  검색 마커
  searchMarkers: { type: Array, default: () => [] },

  // 활성화된 마커
  activeId: { type: String, default: null },
  activeSearchId: { type: String, default: null },
})

const emit = defineEmits(['markerClick', 'searchMarkerClick', 'mapClick', 'ready'])

const el = ref(null)
let map = null

let savedMarkerObjs = new Map()
let searchMarkerObjs = new Map()

const makePinDataUrl = (fill = '#111827', scale = 1) => {
  const w = 32 * scale
  const h = 32 * scale

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 24">
    <path fill="${fill}" d="M12 2c-3.3 0-6 2.7-6 6c0 4.9 6 14 6 14s6-9.1 6-14c0-3.3-2.7-6-6-6zm0 8.2c-1.2 0-2.2-1-2.2-2.2S10.8 5.8 12 5.8s2.2 1 2.2 2.2S13.2 10.2 12 10.2z"/>
  </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const clearMarkerMap = (mapObj) => {
  mapObj.forEach((m) => m.setMap(null))
  mapObj.clear()
}

const clearAllMarkers = () => {
  clearMarkerMap(savedMarkerObjs)
  clearMarkerMap(searchMarkerObjs)
}

const setMarkers = ({ list, store, kind }) => {
  if (!map) return

  clearMarkerMap(store)

  list.forEach((m) => {
    const isSaved = kind === 'saved'
    const marker = new google.maps.Marker({
      map,
      position: { lat: m.lat, lng: m.lng },
      title: m.title ?? '',
      icon: {
        url: isSaved ? makePinDataUrl('#111827', 1) : makePinDataUrl('#94a3b8', 1),
        scaledSize: new google.maps.Size(32, 32),
      },
      zIndex: isSaved ? 20 : 10,
    })

    marker.addListener('click', () => {
      if (isSaved) emit('markerClick', m.id)
      else emit('searchMarkerClick', m.id)
    })

    store.set(m.id, marker)
  })
}

// 마커 스타일
const applyActiveStyle = () => {
  // 저장 마커
  savedMarkerObjs.forEach((marker) => {
    marker.setIcon({
      url: makePinDataUrl('#00b2ff', 1),
      scaledSize: new google.maps.Size(32, 32),
    })
    marker.setZIndex(20)
  })

  // 검색 마커
  searchMarkerObjs.forEach((marker) => {
    marker.setIcon({
      url: makePinDataUrl('#94a3b8', 1),
      scaledSize: new google.maps.Size(32, 32),
    })
    marker.setZIndex(10)
  })

  //저장된 활성화 마커
  if (props.activeId && savedMarkerObjs.has(props.activeId)) {
    const marker = savedMarkerObjs.get(props.activeId)
    marker.setIcon({
      url: makePinDataUrl('#368aff', 1.2),
      scaledSize: new google.maps.Size(38, 38),
    })
    marker.setZIndex(30)
  }

  // 검색된 활성화 마커
  if (props.activeSearchId && searchMarkerObjs.has(props.activeSearchId)) {
    const marker = searchMarkerObjs.get(props.activeSearchId)
    marker.setIcon({
      url: makePinDataUrl('#64748b', 1.2),
      scaledSize: new google.maps.Size(38, 38),
    })
    marker.setZIndex(25)
  }
}

const focusActive = () => {
  if (!map) return

  if (props.activeId && savedMarkerObjs.has(props.activeId)) {
    const m = savedMarkerObjs.get(props.activeId)
    const pos = m.getPosition()
    if (pos) map.panTo(pos)
    return
  }

  if (props.activeSearchId && searchMarkerObjs.has(props.activeSearchId)) {
    const m = searchMarkerObjs.get(props.activeSearchId)
    const pos = m.getPosition()
    if (pos) map.panTo(pos)
  }
}

onMounted(async () => {
  await loadGoogleMaps({ libraries: ['maps', 'places'] })

  map = new google.maps.Map(el.value, {
    center: props.center,
    zoom: props.zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  })

  map.addListener('click', (e) => {
    if (!e?.latLng) return
    emit('mapClick', { lat: e.latLng.lat(), lng: e.latLng.lng() })
  })

  setMarkers({ list: props.markers, store: savedMarkerObjs, kind: 'saved' })
  setMarkers({ list: props.searchMarkers, store: searchMarkerObjs, kind: 'search' })

  applyActiveStyle()
  focusActive()

  emit('ready', map)
})

watch(
  () => props.markers,
  () => {
    setMarkers({ list: props.markers, store: savedMarkerObjs, kind: 'saved' })
    applyActiveStyle()
    focusActive()
  },
  { deep: true },
)

watch(
  () => props.searchMarkers,
  () => {
    setMarkers({ list: props.searchMarkers, store: searchMarkerObjs, kind: 'search' })
    applyActiveStyle()
  },
  { deep: true },
)

watch(
  () => props.activeId,
  () => {
    applyActiveStyle()
    focusActive()
  },
)

watch(
  () => props.activeSearchId,
  () => {
    applyActiveStyle()
    focusActive()
  },
)

watch(
  () => props.center,
  (c) => {
    if (!map || !c) return
    map.panTo(c)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  clearAllMarkers()
  map = null
})
</script>
