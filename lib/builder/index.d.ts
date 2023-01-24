import { Result } from "../result";
export interface Builder<S, T> {
    context: {
        rootDir: string;
        srcDir: string;
        distDir: string;
        sources: S[];
        targets: T[];
    };
    require(path: string): Promise<{
        source: S;
        target: T;
    }>;
    build(path: string): Promise<T>;
    buildAll(): Promise<T[]>;
    requireSync(path: string): Result<{
        source: S;
        target: T;
    }>;
    buildSync(path: string): Result<T>;
    buildAllSync(): Result<T[]>;
}
export * from './classic';
