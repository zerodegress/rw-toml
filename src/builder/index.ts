import { Result } from "../result";

export interface BuilderContext<S, T> {
    sources: S[],
    targets: T[]
}

export interface Builder<S, T> {
    context: BuilderContext<S, T>;
    require(path: string, starter?: string): Result<{source: S,target: T}>;
    build(path: string, started?: string): Result<T>;
    buildAll(): Result<T[]>;
}

export interface PathBuilderContext<S, T> extends BuilderContext<S, T> {
    rootDir: string,
    srcDir: string,
    distDir: string,
}

export interface PathBuilder<S, T> extends Builder<S, T> {
    context: PathBuilderContext<S, T>;
}

export * from './classic';