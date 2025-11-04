// src/lib/api.ts

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!baseURL) {
  console.warn("⚠️ NEXT_PUBLIC_API_BASE_URL is not defined in .env")
}

/**
 * Generic API helper
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseURL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || response.statusText)
  }

  return response.json() as Promise<T>
}
