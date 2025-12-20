import { onBeforeUnmount } from 'vue'

export function useReveal(elRef, options = {}) {
  const { delay = 0, threshold = 0.12, rootMargin = '0px 0px -10% 0px' } = options

  let io = null

  const mount = () => {
    const el = elRef?.value
    if (!el) return

    el.classList.add('reveal-base')
    if (delay) el.style.transitionDelay = `${delay}ms`

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('reveal-in')
            io?.disconnect()
            io = null
          }
        })
      },
      { threshold, rootMargin },
    )

    io.observe(el)
  }

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })

  return { mount }
}
