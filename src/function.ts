import { Optional } from "./optional";

export interface Map<T, Q> {
    (t: T): Q;
}

export type MapFunction<T, Q> = (x: T) => Q;

export interface Transform<T> {
    (t: T): T;
}

export interface Filter<T> extends Map<T, Optional<T>> {}