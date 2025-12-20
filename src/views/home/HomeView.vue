<template>
  <div class="min-h-screen bg-white text-slate-900">
    <HeroSection />
    <HowItWorksSection />
    <ModeSplitSection />
    <StartCtaSection />
    <HomeFooter />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import HowItWorksSection from '@/components/home/HowItWorksSection.vue'
import ModeSplitSection from '@/components/home/ModeSplitSection.vue'
import StartCtaSection from '@/components/home/StartCtaSection.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import '@/views/home/home.css'
</script>
