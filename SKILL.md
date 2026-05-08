# Gastro Map - Design System

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `dominoBlue` | `#006492` | Primary buttons, headers, card titles |
| `dominoRed` | `#e41134` | Danger actions, delete swipe background, error text |
| `dominoWhite` | `#ffffff` | Screen backgrounds, card backgrounds |

## Component Colors

- **Screen background**: `bg-gray-50`
- **Card background**: `bg-white` with `border border-gray-100`
- **Card title**: `text-dominoBlue` (xl, font-bold)
- **Card subtitle**: `text-gray-500` (sm)
- **Image placeholder**: `bg-gray-200` with `text-gray-400`
- **Delete action**: `bg-dominoRed` with `text-white`
- **Primary CTA (FAB)**: `bg-dominoBlue`
- **Loading indicator**: `color="#006492"` (dominoBlue)

## Typography

- Card name: `text-xl font-bold text-dominoBlue`
- Card location: `text-gray-500 text-sm`
- Empty state: `text-gray-500`

## Animations (Reanimated)

| Element | Animation | Trigger |
|---------|-----------|---------|
| DishCard entry | `FadeInDown` | Card mounts (new dish added) |
| DishCard exit | `FadeOutLeft` | Card unmounts (swipe deleted) |
| Card press | `scale` 0.95 via `withSpring` | Tap begins |
| Card swipe | `translateX` via `withTiming` / `withSpring` | Pan gesture |

## Swipe-to-Delete

- Swipe threshold: 30% of screen width (`SCREEN_WIDTH * 0.3`)
- Direction: left only (`translationX < 0`)
- Background reveals red "Eliminar" panel
- Uses `react-native-gesture-handler` (`Gesture.Pan`) + `useAnimatedStyle`

## Tech Stack

- **Expo SDK 54** with Expo Router (file-based routing)
- **NativeWind** (Tailwind CSS via className props)
- **React Native Reanimated** (animations)
- **React Native Gesture Handler** (swipe gestures)
- **Supabase** (backend + auth + storage)
- **TanStack React Query** (server state)
- **TanStack React Form** (form state)
