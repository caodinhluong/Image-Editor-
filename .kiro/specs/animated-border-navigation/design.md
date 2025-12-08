# Design Document

## Overview

This feature implements an animated rotating gradient border effect for navigation items in the Repix AI Editor. The animation uses CSS custom properties (`@property --angle`) and conic gradients to create a smooth, continuously rotating border that enhances the visual appeal of active navigation items.

The existing codebase already contains the CSS foundation for this effect in `src/index.css`, which includes the `.animated-border` utility class with pseudo-elements for the rotating gradient and glow effect.

## Architecture

### Component Structure

```
Layout.tsx (Modified)
├── Desktop Sidebar Navigation
│   └── Navigation Items (with animated-border class)
└── Mobile Bottom Navigation
    └── Navigation Items (with animated-border class)
```

### CSS Architecture

The animation system consists of three layers:

1. **CSS Custom Property**: `--angle` property that animates from 0deg to 360deg
2. **Rotating Border Layer** (`::after` pseudo-element): The main conic gradient border
3. **Glow Layer** (`::before` pseudo-element): A blurred version for the glow effect

## Components and Interfaces

### Modified Component: Layout.tsx

**Changes Required:**
- Add `animated-border` class to active navigation items in desktop sidebar
- Add `animated-border` class to active navigation items in mobile bottom navigation
- Ensure proper z-index stacking context for pseudo-elements

**Implementation Pattern:**

```tsx
// Desktop Sidebar Navigation Item
<button
  className={`
    w-full flex items-center justify-between px-3 py-2.5 rounded-lg 
    text-sm font-medium transition-colors
    ${currentView === item.id ? 'animated-border bg-zinc-100 dark:bg-zinc-800' : '...'}
  `}
>
  {/* content */}
</button>

// Mobile Bottom Navigation Item
<button
  className={`
    flex flex-col items-center justify-center w-full h-full space-y-1
    ${currentView === item.id ? 'animated-border' : '...'}
  `}
>
  {/* content */}
</button>
```

### Existing CSS Utilities (src/index.css)

The following CSS is already implemented and will be utilized:

**CSS Custom Property:**
```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```

**Animated Border Class:**
```css
.animated-border {
  position: relative;
  isolation: isolate;
}

.animated-border::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: conic-gradient(from var(--angle), 
    #ec4899, /* pink */
    #a855f7, /* purple */
    #3b82f6, /* blue */
    #ec4899  /* pink loop */
  );
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: spin-angle 3s linear infinite;
}

.animated-border:hover::after,
.animated-border:focus-within::after {
  opacity: 1;
}
```

**Animation Keyframes:**
```css
@keyframes spin-angle {
  to {
    --angle: 360deg;
  }
}
```

## Data Models

No new data models are required. The feature uses existing component state:
- `currentView`: ViewState - determines which navigation item is active
- `theme`: 'light' | 'dark' - affects color contrast

## Design Decisions

### 1. Trigger Behavior

**Decision:** Show animation on hover AND when item is active (focus-within)

**Rationale:** 
- Provides immediate visual feedback on hover
- Maintains animation for the currently active view
- Uses `:focus-within` to handle keyboard navigation accessibility

### 2. Animation Timing

**Decision:** 3-second rotation duration with linear easing

**Rationale:**
- 3 seconds provides smooth, noticeable rotation without being too fast or distracting
- Linear easing ensures consistent rotation speed
- Infinite loop maintains continuous animation

### 3. Border Thickness

**Decision:** 2px border thickness (`inset: -2px`)

**Rationale:**
- Subtle enough not to overwhelm the UI
- Thick enough to be clearly visible
- Matches the modern, clean design aesthetic

### 4. Color Palette

**Decision:** Use brand colors (pink #ec4899, purple #a855f7, blue #3b82f6)

**Rationale:**
- Maintains brand consistency
- Creates a cohesive gradient that matches the Repix logo
- Works well in both light and dark themes

### 5. Glow Effect

**Decision:** Include a blurred pseudo-element with 50% opacity

**Rationale:**
- Adds depth and premium feel
- 10px blur creates soft, diffused glow
- 50% opacity prevents overwhelming the interface

### 6. Z-Index Strategy

**Decision:** Use `isolation: isolate` and negative z-index for pseudo-elements

**Rationale:**
- Creates new stacking context to prevent z-index conflicts
- Negative z-index keeps border behind content
- Ensures text and icons remain readable

## Error Handling

### Browser Compatibility

**Issue:** `@property` is not supported in older browsers

**Solution:** 
- Graceful degradation - animation simply won't show in unsupported browsers
- Core functionality remains intact
- No JavaScript fallback needed as this is a visual enhancement

### Performance Considerations

**Issue:** Multiple animated elements could impact performance

**Solution:**
- Use CSS transforms and custom properties (GPU-accelerated)
- Limit animation to visible navigation items only
- Use `will-change` if performance issues arise

### Theme Switching

**Issue:** Animation state during theme transitions

**Solution:**
- CSS variables automatically adapt to theme changes
- No JavaScript intervention needed
- Smooth transition maintained via existing theme transition classes

## Testing Strategy

### Visual Testing

1. **Desktop Sidebar**
   - Verify animation appears on active navigation item
   - Verify animation appears on hover
   - Check border thickness and color accuracy
   - Validate glow effect visibility

2. **Mobile Bottom Navigation**
   - Verify animation works on smaller touch targets
   - Check animation doesn't interfere with touch interactions
   - Validate responsive behavior

3. **Theme Compatibility**
   - Test animation in light theme
   - Test animation in dark theme
   - Verify smooth theme transitions

### Performance Testing

1. Monitor frame rate with DevTools Performance panel
2. Verify 60fps animation on standard hardware
3. Test with multiple navigation items visible
4. Check CPU usage during animation

### Browser Testing

1. Test in Chrome/Edge (full support)
2. Test in Firefox (full support)
3. Test in Safari (verify @property support)
4. Verify graceful degradation in older browsers

### Accessibility Testing

1. Verify animation doesn't interfere with keyboard navigation
2. Check that focus states remain visible
3. Ensure animation respects `prefers-reduced-motion` (future enhancement)
4. Validate screen reader compatibility

## Implementation Notes

### Minimal Changes Required

Since the CSS is already implemented in `src/index.css`, the implementation only requires:

1. Adding `animated-border` class to active navigation items in `Layout.tsx`
2. Ensuring proper class ordering for Tailwind CSS specificity
3. Testing across different viewports and themes

### No Breaking Changes

- Existing navigation functionality remains unchanged
- No new dependencies required
- No state management changes needed
- Backward compatible with existing code

### Future Enhancements

1. Add `prefers-reduced-motion` media query support to disable animation for users with motion sensitivity
2. Make animation speed configurable via CSS variable
3. Add option to show animation only on hover vs. always on active items
4. Experiment with different gradient color combinations for special events/themes
