export class BinaryRelation<K> implements Map<K, K> {
    private map = new Map<K, K>();
    
    constructor() {
    }

    has(key: K): boolean {
        return this.get(key) !== undefined;
    }

    get(key: K): K | undefined {
        return this.map.get(key);
    }

    set(key: K, value: K): this {
        this.map.set(key, value);
        this.map.set(value, key);
        return this;
    }

    clear(): void {
        this.map.clear();
    }

    delete(key: K): boolean {
        const value = this.get(key);
        if (value === undefined) return false;
        this.map.delete(value)
        return this.map.delete(key);
    }

    entries(): IterableIterator<[K, K]> {
        return this.map.entries();
    }

    forEach(...args: any[]): void {
        return this.forEach(...args);
    }

    keys(): IterableIterator<K> {
        return this.map.keys();
    }

    values(): IterableIterator<K> {
        return this.map.values();
    }

    get size() {
        return this.map.size;
    }

    [Symbol.iterator]() {
        return this.map[Symbol.iterator]();
    }

    get [Symbol.toStringTag]() {
        return this.map[Symbol.toStringTag];
    }
}