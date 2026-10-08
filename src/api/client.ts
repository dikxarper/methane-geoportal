const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

interface ApiRequestOptions extends RequestInit {
    token?: string | null;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { token, headers, ...requestOptions } = options;

    const response = await fetch(`${API_URL}${path}`, {
        ...requestOptions,

        headers: {
            Accept: "application/json",

            ...(requestOptions.body
                ? {
                      "Content-Type": "application/json",
                  }
                : {}),

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),

            ...headers,
        },
    });

    const contentType = response.headers.get("content-type");

    const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string"
                ? data.message
                : `API error ${response.status}`;

        throw new ApiError(message, response.status, data);
    }

    return data as T;
}

export function getApiUrl() {
    return API_URL;
}
