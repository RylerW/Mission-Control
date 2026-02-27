export interface N8nOptions {
  username?: string; // if n8n basic auth enabled
  password?: string;
}

export class N8nClient {
  private authHeader: string | undefined;

  constructor(options?: N8nOptions) {
    if (options?.username && options?.password) {
      this.authHeader =
        'Basic ' + btoa(`${options.username}:${options.password}`);
    }
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`/n8n${path}`, {
      headers: {
        ...(this.authHeader ? { Authorization: this.authHeader } : {}),
      },
    });

    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`/n8n${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.authHeader ? { Authorization: this.authHeader } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  }
}
