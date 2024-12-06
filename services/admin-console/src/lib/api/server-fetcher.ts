export const serverFetcher = async <T>(
  url: string,
  options?: RequestInit & { token?: string },
): Promise<T> => {
  const headers = {
    ...(!(options?.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options?.token ? { Authorization: `Bearer ${options?.token}` } : {}),
    ...(options?.headers || {}),
  }
  const response = await fetch(url)

  if (!response.ok) {
    const error = new Error(
      `API Request failed\nURL: ${url}\nStatus: ${response.status} ${response.statusText}`,
      { cause: response.status },
    )
    throw error
  }
  const res = await response.json()

  console.log('\x1b[34mresponse\x1b[0m', response)
  console.log('\x1b[32m-------------------------------------------')
  return res
}
