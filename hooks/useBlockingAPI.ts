type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
}

export async function blockingAPI<T>(config: RequestConfig): Promise<T> {
  try {
    const response = await fetch(config.url, {
      method: config.method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
      body: config.data ? JSON.stringify(config.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export const blockingGet = <T>(url: string, params?: Record<string, unknown>) =>
  blockingAPI<T>({
    method: 'get',
    url: params ? `${url}?${new URLSearchParams(params as Record<string, string>).toString()}` : url,
  });

export const blockingPost = <T>(url: string, data?: unknown) =>
  blockingAPI<T>({ method: 'post', url, data });

export const blockingPut = <T>(url: string, data?: unknown) =>
  blockingAPI<T>({ method: 'put', url, data });

export const blockingPatch = <T>(url: string, data?: unknown) =>
  blockingAPI<T>({ method: 'patch', url, data });

export const blockingDelete = <T>(url: string) =>
  blockingAPI<T>({ method: 'delete', url });
