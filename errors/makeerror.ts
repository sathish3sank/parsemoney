import { Semigroup } from "fp-ts/lib/Semigroup";

export type sam = number | undefined;

const sumSemigroup: Semigroup<number> = {
  concat: (a: number, b: number): number => a + b,
};

const sum = <A extends sam, B extends sam>(a: A, b: B) =>
  sumSemigroup.concat(a, b);

console.log(sum(2, undefined));
