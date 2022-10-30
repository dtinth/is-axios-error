import { createServer } from 'http'
import { isAxiosError } from './'

const axios = require('axios/dist/node/axios.cjs')

it('returns true for axios errors', async () => {
  await withServer(async (url) => {
    const error = await (async () => {
      try {
        await axios.get(url)
      } catch (error) {
        return error
      }
      throw new Error('Expected error')
    })()
    expect(isAxiosError(error)).toBe(true)
    expect(isAxiosError(error, 404)).toBe(true)
    expect(isAxiosError(error, 500)).toBe(false)
  })
})

it('returns false for non-axios errors', async () => {
  expect(isAxiosError(new Error('Whatever'))).toBe(false)
  expect(isAxiosError(null)).toBe(false)
  expect(isAxiosError(undefined)).toBe(false)
  expect(isAxiosError(42)).toBe(false)
})

async function withServer(f: (url: string) => any) {
  const server = createServer((req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Nope')
  })
  await new Promise<void>((resolve, reject) => {
    server.listen(0, resolve).on('error', reject)
  })
  const url = `http://localhost:${(server.address() as any).port}`
  try {
    return await f(url)
  } finally {
    server.close()
  }
}
