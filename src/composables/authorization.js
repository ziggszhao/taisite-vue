import { createGlobalState } from '@vueuse/core'

export const STORAGE_AUTHORIZE_KEY = 'Access-Token'

export const useAuthorization = createGlobalState(() => useStorage(STORAGE_AUTHORIZE_KEY))
