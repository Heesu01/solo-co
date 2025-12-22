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

  // 검색 마커
  searchMarkers: { type: Array, default: () => [] },

  // 활성화된 마커
  activeId: { type: [String, Number], default: null },
  activeSearchId: { type: [String, Number], default: null },

  // 저장 마커 경로 연결
  connectSavedRoute: { type: Boolean, default: true },
})

const emit = defineEmits(['markerClick', 'searchMarkerClick', 'mapClick', 'ready'])

const el = ref(null)
let map = null

let savedMarkerObjs = new Map()
let searchMarkerObjs = new Map()

// 저장 경로 라인
let savedRoutePolyline = null

const safeId = (v) => (v == null ? '' : String(v))

const makeNumberPinDataUrl = ({ fill = '#111827', scale = 1, text = '', textFill = '#ffffff' }) => {
  const w = 40 * scale
  const h = 40 * scale

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 48 48">
    <!-- pin -->
    <path fill="${fill}" d="M24 2C15.7 2 9 8.7 9 17c0 12 15 29 15 29s15-17 15-29C39 8.7 32.3 2 24 2z"/>
    <!-- inner circle -->
    <circle cx="24" cy="18" r="10" fill="rgba(255,255,255,0.18)"/>
    <!-- number -->
    <text x="24" y="21.2" text-anchor="middle"
      font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial"
      font-size="14" font-weight="800" fill="${textFill}">
      ${String(text).slice(0, 3)}
    </text>
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

const clearPolyline = () => {
  if (savedRoutePolyline) {
    savedRoutePolyline.setMap(null)
    savedRoutePolyline = null
  }
}

/** 저장 마커들 순서대로 라인 연결 */
const drawSavedRoute = () => {
  if (!map) return
  clearPolyline()

  if (!props.connectSavedRoute) return
  const list = Array.isArray(props.markers) ? props.markers : []
  if (list.length < 2) return

  const path = list
    .filter((m) => typeof m?.lat === 'number' && typeof m?.lng === 'number')
    .map((m) => ({ lat: m.lat, lng: m.lng }))

  if (path.length < 2) return

  savedRoutePolyline = new google.maps.Polyline({
    map,
    path,
    clickable: false,
    geodesic: true,
    strokeOpacity: 0.9,
    strokeWeight: 4,
  })
}

const setMarkers = ({ list, store, kind }) => {
  if (!map) return

  clearMarkerMap(store)

  list.forEach((m, idx) => {
    const isSaved = kind === 'saved'
    const id = safeId(m.id)

    const orderText = isSaved ? String(m.order ?? idx + 1) : ''

    const marker = new google.maps.Marker({
      map,
      position: { lat: m.lat, lng: m.lng },
      title: m.title ?? '',
      icon: {
        url: isSaved
          ? makeNumberPinDataUrl({ fill: '#111827', scale: 1, text: orderText })
          : makeNumberPinDataUrl({ fill: '#94a3b8', scale: 1, text: '' }),
        scaledSize: new google.maps.Size(40, 40),
      },
      zIndex: isSaved ? 20 : 10,
    })

    marker.addListener('click', () => {
      if (isSaved) emit('markerClick', m.id)
      else emit('searchMarkerClick', m.id)
    })

    store.set(id, marker)
  })
}

// active 스타일
const applyActiveStyle = () => {
  // 저장 마커 기본
  savedMarkerObjs.forEach((marker, id) => {
    const idx = (Array.isArray(props.markers) ? props.markers : []).findIndex(
      (x) => safeId(x.id) === id,
    )
    const orderText = String((props.markers?.[idx]?.order ?? (idx >= 0 ? idx + 1 : '')) || '')

    marker.setIcon({
      url: makeNumberPinDataUrl({ fill: '#111827', scale: 1, text: orderText }),
      scaledSize: new google.maps.Size(40, 40),
    })
    marker.setZIndex(20)
  })

  // 검색 마커 기본
  searchMarkerObjs.forEach((marker) => {
    marker.setIcon({
      url: makeNumberPinDataUrl({ fill: '#94a3b8', scale: 1, text: '' }),
      scaledSize: new google.maps.Size(40, 40),
    })
    marker.setZIndex(10)
  })

  // 저장 active
  if (props.activeId != null && savedMarkerObjs.has(safeId(props.activeId))) {
    const id = safeId(props.activeId)
    const marker = savedMarkerObjs.get(id)

    const idx = (Array.isArray(props.markers) ? props.markers : []).findIndex(
      (x) => safeId(x.id) === id,
    )
    const orderText = String((props.markers?.[idx]?.order ?? (idx >= 0 ? idx + 1 : '')) || '')

    marker.setIcon({
      url: makeNumberPinDataUrl({ fill: '#368aff', scale: 1.12, text: orderText }),
      scaledSize: new google.maps.Size(46, 46),
    })
    marker.setZIndex(30)
  }

  // 검색 active
  if (props.activeSearchId != null && searchMarkerObjs.has(safeId(props.activeSearchId))) {
    const marker = searchMarkerObjs.get(safeId(props.activeSearchId))
    marker.setIcon({
      url: makeNumberPinDataUrl({ fill: '#64748b', scale: 1.12, text: '' }),
      scaledSize: new google.maps.Size(46, 46),
    })
    marker.setZIndex(25)
  }
}

const focusActive = () => {
  if (!map) return

  if (props.activeId != null && savedMarkerObjs.has(safeId(props.activeId))) {
    const m = savedMarkerObjs.get(safeId(props.activeId))
    const pos = m.getPosition()
    if (pos) map.panTo(pos)
    return
  }

  if (props.activeSearchId != null && searchMarkerObjs.has(safeId(props.activeSearchId))) {
    const m = searchMarkerObjs.get(safeId(props.activeSearchId))
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

  drawSavedRoute()
  applyActiveStyle()
  focusActive()

  emit('ready', map)
})

watch(
  () => props.markers,
  () => {
    setMarkers({ list: props.markers, store: savedMarkerObjs, kind: 'saved' })
    drawSavedRoute()
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
  clearPolyline()
  map = null
})
</script>
