import { baseApi } from '@/app/api/baseApi.ts'
import { baseQuery } from '@/app/api/baseQuery.ts'
import { AUTH_KEYS } from '@/common/constants'
import { handelErrors, isTokens } from '@/common/utils'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)

        const refreshResult = await baseQuery(
          { url: '/auth/refresh', method: 'post', body: { refreshToken } },
          api,
          extraOptions,
        )

        if (refreshResult.data && isTokens(refreshResult.data)) {
          localStorage.setItem(AUTH_KEYS.accessToken, refreshResult.data.accessToken)
          localStorage.setItem(AUTH_KEYS.refreshToken, refreshResult.data.refreshToken)

          result = await baseQuery(args, api, extraOptions)
        } else {
          // @ts-expect-error
          api.dispatch(baseApi.endpoints.logout.initiate())
        }
      } finally {
        // Всегда освобождаем мьютекс после завершения обновления токена
        release()
      }
    } else {
      // Если процесс обновления токена уже идёт — ждём его завершения
      await mutex.waitForUnlock()
      // После обновления токенов повторяем исходный запрос
      result = await baseQuery(args, api, extraOptions)
    }
  }

  // Обрабатываем все ошибки, кроме 401 Unauthorized (они обрабатываются выше)
  if (result.error && result.error.status !== 401) {
    handelErrors(result.error)
  }

  return result
}
