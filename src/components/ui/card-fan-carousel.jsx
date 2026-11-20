"use client"

import * as React from "react"
import gsap from "gsap"

/**
 * Card Fan Carousel — image cards spread in a fan, like cards in a hand. They come in on an elastic spring, the card
 * under the mouse rises and pushes its neighbors aside, and with more than seven cards the arrows turn the fan one card
 * at a time, in a loop, with the dots below marking the center one.
 *
 * The card size and the spread of the fan come from the width of the carousel, not the screen (container queries): it
 * works in a section narrower than the page. On a short screen, the fan flattens to fit in 70% of the height.
 *
 * The animations are GSAP. The carousel has no background: the cards sit on the page background, and the theme (dark or
 * light) only changes the borders, the shadows, the arrows and the dots.
 */



// with more than seven cards, the fan shows seven and the arrows turn it
const MAX_VISIBLE = 7
const HALF = 3

// the fan of seven: the tilt (degrees), scale, offset (rem) and stacking order of each slot, from left to right
const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
]

// the carousel width ranges, the same as the CSS container queries: how far the fan spreads and its ideal height
function getResponsiveMultiplier(width) {
  if (width < 480) return 0.28
  if (width < 640) return 0.38
  if (width < 768) return 0.5
  if (width < 1024) return 0.75
  return 1.0
}

function getIdealHeight(width) {
  if (width < 480) return 22 * 16
  if (width < 640) return 26 * 16
  if (width < 768) return 28 * 16
  if (width < 1024) return 34 * 16
  return 38 * 16
}

/**
 * How much the fan flattens (0..1]: the CSS caps its height at 70% of the screen, and the heights of the fan and of the
 * entrance shrink in the same proportion.
 */
function getHeightMultiplier(width, height) {
  const ideal = getIdealHeight(width)
  return height >= ideal ? 1 : height / ideal
}

// with fewer than seven cards, the fan opens on the same curve, using only the slots they fill
function getSlotConfig(totalCards, slot) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot]
  const center = totalCards >> 1
  const distance = totalCards > 1 ? (slot - center) / center : 0
  const absDistance = Math.abs(distance)
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  }
}

export function CardFanCarousel({ cards, theme = "dark", className, style }) {
  const rootRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const isAnimating = React.useRef(false)
  const hasEntered = React.useRef(false)
  const directionRef = React.useRef(null)
  const prevVisible = React.useRef(new Set())
  // the entrance waits for the carousel to appear on screen
  const [inView, setInView] = React.useState(false)

  const totalCards = cards.length
  const needsPagination = totalCards > MAX_VISIBLE
  const [centerIndex, setCenterIndex] = React.useState(needsPagination ? HALF : totalCards >> 1)

  const getVisibleMap = React.useCallback(
    (center) => {
      const map = new Map()
      if (!needsPagination) {
        for (let i = 0; i < totalCards; i++) map.set(i, i)
        return map
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot)
      }
      return map
    },
    [totalCards, needsPagination]
  )

  const cycle = React.useCallback(
    (direction) => {
      if (isAnimating.current || !needsPagination) return
      isAnimating.current = true
      directionRef.current = direction
      setCenterIndex(prev =>
        direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
      )
    },
    [totalCards, needsPagination]
  )

  React.useEffect(() => {
    const root = rootRef.current
    if (!root || inView) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(root)
    return () => io.disconnect()
  }, [inView])

  React.useEffect(() => {
    const root = rootRef.current
    const container = containerRef.current
    if (!root || !container || !totalCards || !inView) return

    const cardElements = Array.from(container.querySelectorAll(".cf-card"))
    if (!cardElements.length) return

    const visibleMap = getVisibleMap(centerIndex)
    const previouslyVisible = prevVisible.current
    const direction = directionRef.current
    const isFirstMount = !hasEntered.current
    const multiplier = getResponsiveMultiplier(root.clientWidth)
    const hMult = getHeightMultiplier(root.clientWidth, container.clientHeight)
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards
    const config = (slot) => getSlotConfig(slotCount, slot)

    if (isFirstMount) isAnimating.current = true

    let completedCount = 0
    const visibleCount = visibleMap.size
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false
        if (isFirstMount) hasEntered.current = true
      }
    }

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex)
      const wasVisible = previouslyVisible.has(cardIndex)

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot)
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        }

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 })
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone })
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 })
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone })
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone })
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 })
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 })
      }
    })

    prevVisible.current = new Set(visibleMap.keys())

    // the hover: the card under the mouse rises and grows, and its neighbors move away and tilt a little more
    const visibleEntries = []
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i)
      if (slot !== undefined) visibleEntries.push({ el, slot })
    })
    visibleEntries.sort((a, b) => a.slot - b.slot)

    let activeSlot = null
    let leaveTimer = null
    const centerSlot = visibleEntries.length >> 1

    const updateHoverLayout = (hoveredSlot) => {
      const mult = getResponsiveMultiplier(root.clientWidth)
      const hM = getHeightMultiplier(root.clientWidth, container.clientHeight)

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot)
        let targetX = base.x * mult
        let targetY = base.y * hM
        let targetRot = base.rot
        let targetScale = base.scale
        let delay = 0

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot)
          delay = distance * 0.02

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM
            targetScale *= 1.08
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance))

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult
              targetRot -= 3 / (distance + 1)
            } else {
              targetX += pushStrength * mult
              targetRot += 3 / (distance + 1)
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto",
        })
        gsap.set(el, { zIndex: base.zIndex })
      })
    }

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot) }
      }
      el.addEventListener("mouseenter", handler)
      return { el, handler }
    })

    const onMouseLeave = () => {
      if (isAnimating.current) return
      if (leaveTimer) clearTimeout(leaveTimer)
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null) }, 50)
    }
    container.addEventListener("mouseleave", onMouseLeave)

    // the carousel width changed: the fan reopens in the new range (the first reading is the current one; it is skipped)
    let measured = false
    const ro = new ResizeObserver(() => {
      if (!measured) { measured = true; return }
      if (!isAnimating.current) updateHoverLayout(activeSlot)
    })
    ro.observe(root)

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler))
      container.removeEventListener("mouseleave", onMouseLeave)
      ro.disconnect()
      if (leaveTimer) clearTimeout(leaveTimer)
    }
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, inView])

  // on leaving the page, the animations still running stop with it
  React.useEffect(() => {
    const container = containerRef.current
    return () => {
      if (container) gsap.killTweensOf(container.querySelectorAll(".cf-card"))
    }
  }, [])

  if (!totalCards) return null

  const chevron = (direction) => (
    <svg className="cf-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  )

  return (
    <div ref={rootRef} className={"cf-root" + (className ? " " + className : "")} data-theme={theme} style={style}>
      {/* the raw CSS: as a text child, React 18 SSR would escape the quotes and break the selectors */}
      <style dangerouslySetInnerHTML={{ __html: CF_CSS }} />
      <section className="cf-section">
        <div className="cf-frame">
          <div ref={containerRef} className="cf-fan">
            {cards.map((card, index) => {
              const image = (
                <div className="cf-media">
                  <img src={card.imgUrl} loading="lazy" alt={card.alt || `Card ${index + 1}`} className="cf-img" />
                </div>
              )
              return card.linkUrl ? (
                <a
                  key={index}
                  href={card.linkUrl}
                  target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="cf-card cf-card--link"
                >
                  {image}
                </a>
              ) : (
                <div key={index} className="cf-card">{image}</div>
              )
            })}
          </div>
        </div>

        {needsPagination && (
          <div className="cf-controls">
            <button type="button" className="cf-arrow" onClick={() => cycle("left")} aria-label="Previous">
              {chevron("left")}
            </button>
            <div className="cf-dots">
              {cards.map((_, i) => (
                <span key={i} className={"cf-dot" + (i === centerIndex ? " cf-dot--active" : "")} />
              ))}
            </div>
            <button type="button" className="cf-arrow" onClick={() => cycle("right")} aria-label="Next">
              {chevron("right")}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default CardFanCarousel

const CF_CSS = `
/* what the project can change with a class (width, margin): in the base layer, which comes before component classes
   and utilities (Tailwind v4) and loses to CSS outside any layer (Tailwind v3, CSS Modules, plain CSS) */
@layer base {
  .cf-root { position: relative; width: 100%; margin: 0; }
}
.cf-root {
  container-type: inline-size;
  box-sizing: border-box;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  --cf-card-border: rgba(255, 255, 255, .08);
  --cf-card-shadow: 0 15px 35px rgba(0, 0, 0, .5);
  --cf-arrow-border: rgba(255, 255, 255, .1);
  --cf-arrow-border-hover: rgba(255, 255, 255, .25);
  --cf-arrow-bg: rgba(255, 255, 255, .05);
  --cf-arrow-color: rgba(255, 255, 255, .55);
  --cf-arrow-color-hover: rgba(255, 255, 255, .8);
  --cf-arrow-ring: rgba(255, 255, 255, .04);
  --cf-arrow-shadow: 0 4px 20px rgba(0, 0, 0, .4);
  --cf-dot: rgba(255, 255, 255, .15);
  --cf-dot-active: rgba(255, 255, 255, .8);
}
.cf-root[data-theme="light"] {
  --cf-card-border: rgba(0, 0, 0, .08);
  --cf-card-shadow: 0 15px 35px rgba(0, 0, 0, .15);
  --cf-arrow-border: rgba(0, 0, 0, .1);
  --cf-arrow-border-hover: rgba(0, 0, 0, .25);
  --cf-arrow-bg: rgba(0, 0, 0, .05);
  --cf-arrow-color: rgba(0, 0, 0, .4);
  --cf-arrow-color-hover: rgba(0, 0, 0, .7);
  --cf-arrow-ring: rgba(0, 0, 0, .04);
  --cf-arrow-shadow: 0 4px 20px rgba(0, 0, 0, .1);
  --cf-dot: rgba(0, 0, 0, .15);
  --cf-dot-active: rgba(0, 0, 0, .7);
}
.cf-root *, .cf-root *::before, .cf-root *::after { box-sizing: border-box; }

.cf-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 1rem;
}
.cf-frame { display: flex; align-items: center; justify-content: center; width: 100%; max-width: 90rem; }

/* the fan: all the cards sit in the center and GSAP opens each one into its slot. The height is the ideal one for the
   width range, up to 70% of the screen (--cf-vh is 1% of the reference height, the screen's by default) */
.cf-fan {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 80rem;
  height: min(38rem, calc(70 * var(--cf-vh, 1vh)));
}
.cf-card {
  position: absolute;
  display: block;
  width: min(20rem, calc(36.84 * var(--cf-vh, 1vh)));
  height: min(35rem, calc(64.47 * var(--cf-vh, 1vh)));
  margin: 0;
  padding: 0;
  overflow: clip;
  border: 1px solid var(--cf-card-border);
  border-radius: min(3.316rem, calc(6.11 * var(--cf-vh, 1vh)));
  background: transparent;
  box-shadow: var(--cf-card-shadow);
  opacity: 0;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.cf-card--link { cursor: pointer; }
/* an invisible strip under each card: with the card lifted on hover, the mouse just below it still counts as on it */
.cf-card::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4rem;
  z-index: 100;
  height: 4rem;
  pointer-events: auto;
}
.cf-media { position: relative; width: 100%; height: 100%; overflow: hidden; }
.cf-img {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  margin: 0;
  object-fit: cover;
}

.cf-controls { position: relative; z-index: 30; display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; }
.cf-dots { display: flex; align-items: center; gap: .5rem; }
.cf-dot { display: block; width: .5rem; height: .5rem; border-radius: 9999px; background: var(--cf-dot); transition: all .3s cubic-bezier(.4, 0, .2, 1); }
.cf-dot--active { background: var(--cf-dot-active); transform: scale(1.3); }

.cf-arrow {
  position: relative;
  z-index: 30;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0;
  padding: 0;
  border: 1.5px solid var(--cf-arrow-border);
  border-radius: 9999px;
  background: var(--cf-arrow-bg);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  color: var(--cf-arrow-color);
  box-shadow: var(--cf-arrow-shadow);
  font: inherit;
  cursor: pointer;
  outline: none;
  transition: color .3s cubic-bezier(.4, 0, .2, 1), border-color .3s cubic-bezier(.4, 0, .2, 1);
}
.cf-arrow::before {
  content: "";
  position: absolute;
  inset: 3px;
  border: 1px solid var(--cf-arrow-ring);
  border-radius: 9999px;
  pointer-events: none;
}
.cf-arrow:hover { border-color: var(--cf-arrow-border-hover); color: var(--cf-arrow-color-hover); }
.cf-arrow:focus-visible { border-color: var(--cf-arrow-border-hover); color: var(--cf-arrow-color-hover); }
.cf-arrow:active { opacity: .7; }
.cf-chevron { position: relative; z-index: 2; display: block; width: 1rem; height: 1rem; }

/* the carousel width ranges, the same as getResponsiveMultiplier */
@container (min-width: 768px) {
  .cf-section { padding-inline: 2rem; }
  .cf-controls { margin-top: 1.5rem; }
  .cf-arrow { width: 3rem; height: 3rem; }
  .cf-chevron { width: 1.25rem; height: 1.25rem; }
}
@container (min-width: 1024px) {
  .cf-section { padding-block: 2rem; }
}
@container (max-width: 1023.98px) {
  .cf-fan { height: min(34rem, calc(70 * var(--cf-vh, 1vh))); }
  .cf-card {
    width: min(16rem, calc(32.94 * var(--cf-vh, 1vh)));
    height: min(28rem, calc(57.65 * var(--cf-vh, 1vh)));
    border-radius: min(2.6rem, calc(5.35 * var(--cf-vh, 1vh)));
  }
}
@container (max-width: 767.98px) {
  .cf-fan { height: min(28rem, calc(70 * var(--cf-vh, 1vh))); }
  .cf-card {
    width: min(12rem, calc(30 * var(--cf-vh, 1vh)));
    height: min(21rem, calc(52.5 * var(--cf-vh, 1vh)));
    border-radius: min(2rem, calc(5 * var(--cf-vh, 1vh)));
  }
}
@container (max-width: 639.98px) {
  .cf-fan { height: min(26rem, calc(70 * var(--cf-vh, 1vh))); }
  .cf-card {
    width: min(9rem, calc(24.23 * var(--cf-vh, 1vh)));
    height: min(15.75rem, calc(42.4 * var(--cf-vh, 1vh)));
    border-radius: min(1.5rem, calc(4.04 * var(--cf-vh, 1vh)));
  }
}
@container (max-width: 479.98px) {
  .cf-fan { height: min(22rem, calc(70 * var(--cf-vh, 1vh))); }
  .cf-card {
    width: min(7rem, calc(22.27 * var(--cf-vh, 1vh)));
    height: min(12.25rem, calc(38.98 * var(--cf-vh, 1vh)));
    border-radius: min(1.2rem, calc(3.82 * var(--cf-vh, 1vh)));
  }
}
`
