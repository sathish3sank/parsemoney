import * as t from "io-ts";

export type ErrorType = "DomainRule" | "BadInput";

interface BaseError extends Error {
  __customError__: "__baseError__";
  message: string;
  _raw?: string;
  status?: string;
}

const CommonErrors = t.union([
  t.literal("Different_Currency_type"),
  t.literal("Invalid_Currency"),
]);

export type CommonErrorTags = t.TypeOf<typeof CommonErrors>;

interface BrandErrorType<ErrorTypeT extends ErrorType> {
  type: ErrorTypeT;
}

interface BrandErrorTags<ErrorT extends string> {
  tag: ErrorT;
}

export type Err<Tags extends string, Types extends ErrorType> = BaseError &
  BrandErrorType<Types> &
  BrandErrorTags<Tags>;

const makeCurrencyError = <
  Types extends ErrorType,
  Tags extends CommonErrorTags
>(
  typ: Types,
  tag: Tags
) => (message: string, _raw?: string): Err<Tags, Types> => {
  return {
    __customError__: "__baseError__",
    message: message,
    name: "makeCurrencyError",
    _raw: _raw ? _raw : message,
    type: typ,
    tag,
  };
};

export const differentCurrencyError = makeCurrencyError(
  "DomainRule",
  "Different_Currency_type"
);

export const invalidCurrencyError = makeCurrencyError(
  "BadInput",
  "Invalid_Currency"
);
