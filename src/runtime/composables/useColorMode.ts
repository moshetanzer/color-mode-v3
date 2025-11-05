import { computed, watch, ref } from 'vue'
import { useCookie, useNuxtApp } from '#app'

export type ColorMode = 'light' | 'dark' | 'system'

export interface ColorModeState {
  preference: ColorMode
  value: 'light' | 'dark'
}

export const useColorMode = () => {
  const nuxtApp = useNuxtApp()
  const config = nuxtApp.$config.public.colorMode

  const preference = useCookie<ColorMode>(config.cookieName, {
    default: () => config.preference as ColorMode,
    sameSite: 'lax',
  })

  const systemPreference = ref<'light' | 'dark'>(config.fallback)
  const isHydrated = ref(false)

  if (import.meta.client) {
    systemPreference.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const value = computed<'light' | 'dark'>(() => {
    if (!isHydrated.value && import.meta.server) {
      return preference.value === 'system' ? config.fallback : preference.value
    }

    if (preference.value === 'system') {
      return systemPreference.value
    }
    return preference.value
  })

  const state = computed<ColorModeState>(() => ({
    preference: preference.value,
    value: value.value,
  }))

  const setColorMode = (newMode: ColorMode) => {
    preference.value = newMode
  }

  if (import.meta.client) {
    systemPreference.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    isHydrated.value = true

    const html = document.documentElement
    const initialValue = preference.value === 'system'
      ? systemPreference.value
      : preference.value

    html.setAttribute(config.dataAttribute, initialValue)
    html.classList.remove(`${config.classPrefix}light${config.classSuffix}`, `${config.classPrefix}dark${config.classSuffix}`)
    html.classList.add(`${config.classPrefix}${initialValue}${config.classSuffix}`)

    watch(value, (newValue, oldValue) => {
      html.setAttribute(config.dataAttribute, newValue)

      if (oldValue && oldValue !== newValue) {
        html.classList.remove(`${config.classPrefix}${oldValue}${config.classSuffix}`)
      }
      html.classList.add(`${config.classPrefix}${newValue}${config.classSuffix}`)
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      systemPreference.value = e.matches ? 'dark' : 'light'
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    if (nuxtApp.vueApp) {
      nuxtApp.hooks.hook('app:unmounted', () => {
        mediaQuery.removeEventListener('change', handleSystemChange)
      })
    }
  }

  return {
    preference,
    value,
    state,
    setColorMode,
  }
}
