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

  // AI 추천 경로 미리보기 마커
  aiMarkers: { type: Array, default: () => [] },

  // 활성화된 마커
  activeId: { type: String, default: null },
  activeSearchId: { type: String, default: null },
})

const emit = defineEmits(['markerClick', 'searchMarkerClick', 'mapClick', 'ready'])

const el = ref(null)
let map = null

let savedMarkerObjs = new Map()
let searchMarkerObjs = new Map()
let aiMarkerObjs = new Map()

let aiPolyline = null

const makePinDataUrl = ({
  fill = '#111827',
  scale = 1,
  inner = 'rgba(255,255,255,0.22)',
  dot = 'rgba(255,255,255,0.95)',
} = {}) => {
  const w = 40 * scale
  const h = 40 * scale

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 48 48">
    <defs>
      <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.28"/>
      </filter>
    </defs>

    <g filter="url(#ds)">
      <path
        fill="${fill}"
        d="M24 2C15.7 2 9 8.7 9 17c0 12 15 29 15 29s15-17 15-29C39 8.7 32.3 2 24 2z"
      />
      <circle cx="24" cy="18" r="10" fill="${inner}" />
      <circle cx="24" cy="18" r="3.4" fill="${dot}" />
    </g>
  </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const makeNumberMarkerUrl = (number, { fill = '#111827' } = {}) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
    <defs>
      <filter id="ds">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#ds)">
      <circle cx="21" cy="21" r="18" fill="${fill}" />
      <text
        x="21"
        y="25"
        text-anchor="middle"
        font-size="14"
        font-weight="700"
        fill="white"
        font-family="Inter, system-ui, sans-serif"
      >
        ${number}
      </text>
    </g>
  </svg>
  `.trim()
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const clearMarkerMap = (mapObj) => {
  mapObj.forEach((m) => m.setMap(null))
  mapObj.clear()
}

const clearAiPolyline = () => {
  if (aiPolyline) {
    aiPolyline.setMap(null)
    aiPolyline = null
  }
}

const clearAllMarkers = () => {
  clearMarkerMap(savedMarkerObjs)
  clearMarkerMap(searchMarkerObjs)
  clearMarkerMap(aiMarkerObjs)
  clearAiPolyline()
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
        url: isSaved ? makePinDataUrl({ fill: '#111827' }) : makePinDataUrl({ fill: '#9ca3af' }),
        scaledSize: new google.maps.Size(40, 40),
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

const setAiMarkers = () => {
  if (!map) return
  clearMarkerMap(aiMarkerObjs)

  const list = Array.isArray(props.aiMarkers) ? props.aiMarkers : []
  list.forEach((m) => {
    if (typeof m.lat !== 'number' || typeof m.lng !== 'number') return

    const marker = new google.maps.Marker({
      map,
      position: { lat: m.lat, lng: m.lng },
      title: m.title ?? '',
      icon: {
        url: makeNumberMarkerUrl(m.order ?? 1, { fill: '#111827' }),
        scaledSize: new google.maps.Size(42, 42),
      },
      zIndex: 40,
    })

    aiMarkerObjs.set(m.id ?? `${m.lat},${m.lng},${m.order ?? 1}`, marker)
  })

  drawAiPolyline()
}

const drawAiPolyline = () => {
  if (!map) return
  clearAiPolyline()

  const list = Array.isArray(props.aiMarkers) ? props.aiMarkers : []
  const points = list
    .filter((m) => typeof m.lat === 'number' && typeof m.lng === 'number')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((m) => ({ lat: m.lat, lng: m.lng }))

  if (points.length < 2) return

  aiPolyline = new google.maps.Polyline({
    path: points,
    map,
    strokeColor: '#111827',
    strokeOpacity: 0.9,
    strokeWeight: 4,
    geodesic: true,
    zIndex: 35,
  })
}

const applyActiveStyle = () => {
  // 저장 마커 기본
  savedMarkerObjs.forEach((marker) => {
    marker.setIcon({
      url: makePinDataUrl({ fill: '#64748b' }),
      scaledSize: new google.maps.Size(40, 40),
    })
    marker.setZIndex(20)
  })

  // 검색 마커 기본
  searchMarkerObjs.forEach((marker) => {
    marker.setIcon({
      url: makePinDataUrl({ fill: '#9ca3af' }),
      scaledSize: new google.maps.Size(40, 40),
    })
    marker.setZIndex(10)
  })

  // 저장 활성
  if (props.activeId && savedMarkerObjs.has(props.activeId)) {
    const marker = savedMarkerObjs.get(props.activeId)
    marker.setIcon({
      url: makePinDataUrl({
        fill: '#111827',
        scale: 1.12,
        inner: 'rgba(255,255,255,0.28)',
      }),
      scaledSize: new google.maps.Size(46, 46),
    })
    marker.setZIndex(30)
  }

  // 검색 활성
  if (props.activeSearchId && searchMarkerObjs.has(props.activeSearchId)) {
    const marker = searchMarkerObjs.get(props.activeSearchId)
    marker.setIcon({
      url: makePinDataUrl({
        fill: '#1d4ed8',
        scale: 1.12,
        inner: 'rgba(255,255,255,0.26)',
      }),
      scaledSize: new google.maps.Size(46, 46),
    })
    marker.setZIndex(25)
  }

  // AI 마커 기본
  aiMarkerObjs.forEach((marker) => {
    marker.setZIndex(40)
  })
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

  setAiMarkers()

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
  () => props.aiMarkers,
  () => {
    setAiMarkers()
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
