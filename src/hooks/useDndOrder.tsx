import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";

const sameIds = (a: string[], b: string[]) =>
    a.length === b.length && a.every((x, i) => x === b[i]);

export function useDndOrder<T>(
    items: T[],
    getId: (item: T) => string,
    storageKey?: string
) {
    const [order, setOrder] = useState<string[]>([]);

    // getId estable via ref
    const getIdRef = useRef(getId);
    useEffect(() => { getIdRef.current = getId; }, [getId]);

    // ids derivados de items (no dependemos de getId directamente)
    const ids = useMemo(() => items.map(i => getIdRef.current(i)), [items]);

    useEffect(() => {
        let next: string[] | null = null;

        if (storageKey) {
            try {
                const raw = localStorage.getItem(storageKey);
                if (raw) {
                    const saved = JSON.parse(raw) as string[];
                    const valid = saved.filter(id => ids.includes(id));
                    if (valid.length) next = valid;
                }
            } catch (err) {
                if (import.meta.env.DEV) console.debug("useDndOrder: ignore LS/JSON error", err);
            }
        }

        if (!next) next = ids;

        setOrder(prev => (sameIds(prev, next!) ? prev : next!));
    }, [ids, storageKey]);

    const ordered = useMemo(() => {
        const map = new Map(items.map(i => [getIdRef.current(i), i]));
        const fromOrder = order.map(id => map.get(id)).filter(Boolean) as T[];
        const missing = items.filter(i => !order.includes(getIdRef.current(i)));
        return [...fromOrder, ...missing];
    }, [items, order]);

    const onDragEnd = useCallback((result: DropResult) => {
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;

        setOrder(prev => {
            const next = [...prev];
            const [moved] = next.splice(source.index, 1);
            next.splice(destination.index, 0, moved);
            if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    }, [storageKey]);

    return { ordered, onDragEnd, order, setOrder };
}
