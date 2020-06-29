import { sequenceT } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import { Eq } from "fp-ts/lib/Eq";
import { Semigroup } from "fp-ts/lib/Semigroup";
import { differentCurrencyError, invalidCurrencyError } from "./errors";

const seqteither = sequenceT(either);

const CurrencyType = t.union([t.literal("$"), t.literal("I")]);

const Currency = t.type({
  value: t.number,
  type: CurrencyType,
});

type Currency = t.TypeOf<typeof Currency>;

const semigroupCurrency: Semigroup<Currency> = {
  concat: (x, y) => ({ value: x.value + y.value, type: x.type }),
};

const sameCurrency: Eq<Currency> = {
  equals: (x, y) => x.type === y.type,
};

const CurrencyToString = (c: Currency) => `${c.type}${c.value}`;

const makeCurrency = (c: string): E.Either<any, Currency> => {
  const [first, ...rest] = c.split("");
  const x = CurrencyType.decode(first);
  const number = NumberFromString.decode(rest.join(""));
  const result = pipe(
    seqteither(x, number),
    E.map(([cu, value]) => ({ value, type: cu })),
    E.chain((x) => Currency.decode(x)),
    E.mapLeft((_) => invalidCurrencyError("Invalid Currency"))
  );
  return result;
};

const addCurrency = (c1: string, c2: string) => {
  const m1 = makeCurrency(c1);
  const m2 = makeCurrency(c2);
  const parsedCurrency = A.array.sequence(either)([m1, m2]);
  return pipe(
    parsedCurrency,
    E.chainW(([f, s]) =>
      sameCurrency.equals(f, s)
        ? E.right(semigroupCurrency.concat(f, s))
        : E.left(differentCurrencyError("Cannot add different currency type"))
    ),
    E.map(CurrencyToString)
  );
};

E.fold(console.log, console.log)(addCurrency("$67", "$33"));
