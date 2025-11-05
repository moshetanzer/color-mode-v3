import { defineNuxtPlugin, useCookie, useHead } from '#app'
import type { ColorMode } from './composables/useColorMode'

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config.public.colorMode

  const colorModeCookie = useCookie<ColorMode>(config.cookieName, {
    default: () => config.preference as ColorMode,
    sameSite: 'lax',
  })

  useHead({
    script: [
      {
        innerHTML: `
          (function() {
            const preference = document.cookie.match(/${config.cookieName}=([^;]+)/)?.[1] || '${config.preference}';
            let colorMode = preference;
            
            if (preference === 'system') {
              colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            document.documentElement.setAttribute('${config.dataAttribute}', colorMode);
            document.documentElement.classList.add(colorMode + '${config.classSuffix}');
          })();
        `.trim(),
        type: 'text/javascript',
        tagPosition: 'head',
      },
    ],
  })

  return {
    provide: {
      colorModeCookie,
    },
  }
})
