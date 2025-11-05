import { defineNuxtModule, addPlugin, createResolver, addImports } from '@nuxt/kit'

export interface ModuleOptions {
  cookieName?: string
  preference?: 'dark' | 'light' | 'system'
  fallback?: 'dark' | 'light'
  dataAttribute?: string
  classPrefix?: string
  classSuffix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'color-mode',
    configKey: 'colorModeNew',
  },
  defaults: {
    cookieName: 'nuxt-color-mode',
    preference: 'system',
    fallback: 'light',
    dataAttribute: 'data-color-mode',
    classPrefix: '',
    classSuffix: '-mode',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.colorMode = options

    addPlugin(resolver.resolve('./runtime/plugin'))

    addImports({
      name: 'useColorMode',
      from: resolver.resolve('./runtime/composables/useColorMode'),
    })
  },
})
