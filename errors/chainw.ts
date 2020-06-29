import { sequenceT } from "fp-ts/lib/Apply";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";
import { Either, either } from "fp-ts/lib/Either";
import { NumberFromString } from "io-ts-types/lib/NumberFromString";
import { pipe } from "fp-ts/lib/pipeable";
import * as A from "fp-ts/lib/Array";
import { Eq } from "fp-ts/lib/Eq";
import { Semigroup } from "fp-ts/lib/Semigroup";
