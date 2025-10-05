const PREFIX = "hc";

const k = (key: string) => `${PREFIX}:${key}`;

type Box<T> = { v: T; exp?: number };

export const storage = {
    set<T>(key: string, value: T) {
        localStorage.setItem(k(key), JSON.stringify({ v: value } as Box<T>));
    },
    get<T>(key: string, fallback?: T): T | undefined {
        const raw = localStorage.getItem(k(key));
        if (!raw) return fallback;
        try {
            const box = JSON.parse(raw) as Box<T>;
            if (box.exp && Date.now() > box.exp) {
                localStorage.removeItem(k(key));
                return fallback;
            }
            return box.v;
        } catch {
            return fallback;
        }
    },
    setWithTTL<T>(key: string, value: T, ttlMs: number) {
        localStorage.setItem(
            k(key),
            JSON.stringify({ v: value, exp: Date.now() + ttlMs } as Box<T>)
        );
    },
    remove(key: string) {
        localStorage.removeItem(k(key));
    },
    clearPrefix() {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(`${PREFIX}:`)) localStorage.removeItem(key);
        });
    },
};

export const STORAGE_KEYS = {
    accessToken: "auth:access",
    refreshToken: "auth:refresh",
};
