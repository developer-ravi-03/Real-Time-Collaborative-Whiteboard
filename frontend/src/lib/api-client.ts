import type { ApiResponse } from "@/types/api";
import type { CurrentPage } from "@/types/board";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export type GetToken = (
  options?: {
    skipCache?: boolean;
  },
) => Promise<string | null>;

const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms),
  );

async function getAuthToken(
  getToken: GetToken,
) {
  for (
    let attempt = 0;
    attempt < 5;
    attempt++
  ) {
    const token = await getToken({
      skipCache: true,
    });

    if (token) {
      return token;
    }

    await sleep(300);
  }

  return null;
}

export async function apiRequest<T>(
  getToken: GetToken,
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    await getAuthToken(getToken);

  if (!token) {
    throw new Error(
      "Authentication session is not ready. Please try again.",
    );
  }

  const headers = new Headers(
    options.headers,
  );

  headers.set(
    "Content-Type",
    "application/json",
  );

  headers.set(
    "Authorization",
    `Bearer ${token}`,
  );

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return data;
}

/*
 * ==========================================================
 * SAVE CANVAS
 * ==========================================================
 *
 * Persists the complete Fabric canvas JSON for one page.
 */

export async function saveCanvas(
  getToken: GetToken,
  pageId: string,
  canvasData: Record<string, unknown>,
): Promise<
  ApiResponse<CurrentPage>
> {
  return apiRequest<
    ApiResponse<CurrentPage>
  >(
    getToken,
    `/pages/${pageId}/canvas`,
    {
      method: "PATCH",

      body: JSON.stringify({
        canvasData,
      }),
    },
  );
}