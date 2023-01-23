import { Result } from "../error";

export interface Builder<S, T> {
    context: { 
        rootDir: string, 
        sources: S[], 
        targets: T[],
    };

    require(path: string): Promise<Result<{source: S,target: T}>>;
    build(path: string): Promise<Result<T>>;
    buildAll(): Promise<Result<T[]>>;

    requireSync(path: string): Result<{source: S,target: T}>;
    buildSync(path: string): Result<T>;
    buildAllSync(): Result<T[]>;
}