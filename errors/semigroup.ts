import { ordNumber, contramap } from "fp-ts/lib/Ord";
import {
  getMeetSemigroup,
  getJoinSemigroup,
  Semigroup,
  getStructSemigroup,
  getFunctionSemigroup,
  semigroupAll,
  fold,
  semigroupProduct,
  semigroupSum,
  semigroupAny,
  semigroupString,
  getDualSemigroup,
  getIntercalateSemigroup,
  getObjectSemigroup,
} from "fp-ts/lib/Semigroup";

import { getApplySemigroup, some, none } from "fp-ts/lib/Option";

import { getMonoid } from "fp-ts/lib/Array";

import * as O from "fp-ts/lib/Option";

interface Customer {
  name: string;
  address: string;
  favouriteThings: Array<string>;
  hasMadePurchase: boolean;
  registered_at: number;
  updated_at: number;
}

type Point = {
  x: number;
  y: number;
};

type Vector = {
  from: Point;
  to: Point;
};

const semigroupMin: Semigroup<number> = getMeetSemigroup(ordNumber);

const semigroupMax: Semigroup<number> = getJoinSemigroup(ordNumber);

const semigroupPoint: Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: semigroupSum.concat(p1.x, p2.x),
    y: semigroupSum.concat(p2.y, p2.y),
  }),
};

const semigroupVector: Semigroup<Point> = getStructSemigroup({
  x: semigroupMin,
  y: semigroupMax,
});

const setSemigroupVector: Semigroup<Vector> = getStructSemigroup({
  from: semigroupVector,
  to: semigroupVector,
});

const isPositiveX = (p: Point): boolean => p.x >= 0;
const isNegativeY = (p: Point): boolean => p.x >= 0;

const semigroupPredicate: Semigroup<(
  p: Point
) => boolean> = getFunctionSemigroup(semigroupAll)<Point>();

const isPositiveXY = semigroupPredicate.concat(isPositiveX, isNegativeY);

const sum = fold(semigroupSum);
const product = fold(semigroupProduct);

const s = getApplySemigroup(semigroupSum);

const semigroupCustomer: Semigroup<Customer> = getStructSemigroup({
  name: getJoinSemigroup(contramap((s: string) => s.length)(ordNumber)),
  favouriteThings: getMonoid<string>(),
  address: getJoinSemigroup(contramap((s: string) => s.length)(ordNumber)),
  hasMadePurchase: semigroupAny,
  registered_at: getMeetSemigroup(ordNumber),
  updated_at: getJoinSemigroup(ordNumber),
});

const t = semigroupCustomer.concat(
  {
    name: "Sankar",
    address: "Chennai",
    favouriteThings: [],
    hasMadePurchase: false,
    registered_at: new Date("2019-09-10").getTime(),
    updated_at: new Date("2020-03-10").getTime(),
  },
  {
    name: "Sankar",
    address: "Kadayanallur",
    favouriteThings: ["Chapathi"],
    hasMadePurchase: true,
    registered_at: new Date("2019-09-10").getTime(),
    updated_at: new Date().getTime(),
  }
);

const dualSemigroup = getDualSemigroup(semigroupString);
const interclateSemigroup = getIntercalateSemigroup("")(semigroupString);

type semigroupSample = {
  readonly x: number;
  readonly y?: number;
};

const sample1: semigroupSample = {
  x: 3,
  y: 9,
};

const sample2: semigroupSample = {
  x: 13,
};

const sampleSemigroup: Semigroup<semigroupSample> = getStructSemigroup({
  x: getMeetSemigroup(ordNumber),
  y: getJoinSemigroup(contramap((s: number) => s)(ordNumber)),
});

const objectSemigroup = getObjectSemigroup<semigroupSample>();
