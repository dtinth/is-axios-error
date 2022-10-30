import { AxiosError } from 'axios'

/**
 * Returns whether the given error is an AxiosError. Can be used to narrow the
 * type of the error.
 * @param e - The error to check.
 * @param status - An expected status code to check for. If not provided, any status code will be accepted.
 * @returns Whether the given error is an AxiosError.
 * @example
 * ```ts
 * try {
 *   await axios.get('https://example.com/thing.txt')
 *   return true
 * } catch (e: unknown) {
 *   if (!isAxiosError(e, 404)) throw e
 *   return false
 * }
 * ```
 * @public
 */

export function isAxiosError(e: any, status?: number): e is AxiosError {
  return !!e?.isAxiosError && (!status || e.response?.status === status)
}
