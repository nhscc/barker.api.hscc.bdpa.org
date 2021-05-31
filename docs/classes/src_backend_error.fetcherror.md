[barker.api.hscc.bdpa.org][1] / [src/backend/error][2] / FetchError

# Class: FetchError

[src/backend/error][2].FetchError

## Hierarchy

- [_AppError_][3]

  ↳ **FetchError**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [message][5]
- [name][6]
- [stack][7]
- [prepareStackTrace][8]
- [stackTraceLimit][9]

### Methods

- [captureStackTrace][10]

## Constructors

### constructor

\+ **new FetchError**(`res`: Response, `error?`: _string_): [_FetchError_][11]

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `res`    | Response |
| `error?` | _string_ |

**Returns:** [_FetchError_][11]

Overrides: [AppError][3]

Defined in: node_modules/named-app-errors/dist/modules/index.d.ts:14

## Properties

### message

• **message**: _string_

Inherited from: [AppError][3].[message][12]

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: _string_

Inherited from: [AppError][3].[name][13]

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: _string_

Inherited from: [AppError][3].[stack][14]

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`:
CallSite\[]) => _any_

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][15]

#### Type declaration

▸ (`err`: Error, `stackTraces`: CallSite\[]): _any_

#### Parameters

| Name          | Type       |
| :------------ | :--------- |
| `err`         | Error      |
| `stackTraces` | CallSite[] |

**Returns:** _any_

Inherited from: [AppError][3].[prepareStackTrace][16]

Defined in: node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: _number_

Inherited from: [AppError][3].[stackTraceLimit][17]

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`: _object_, `constructorOpt?`:
Function): _void_

Create .stack property on a target object

#### Parameters

| Name              | Type     |
| :---------------- | :------- |
| `targetObject`    | _object_ |
| `constructorOpt?` | Function |

**Returns:** _void_

Inherited from: [AppError][3]

Defined in: node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/src_backend_error.md
[3]: src_backend_error.apperror.md
[4]: src_backend_error.fetcherror.md#constructor
[5]: src_backend_error.fetcherror.md#message
[6]: src_backend_error.fetcherror.md#name
[7]: src_backend_error.fetcherror.md#stack
[8]: src_backend_error.fetcherror.md#preparestacktrace
[9]: src_backend_error.fetcherror.md#stacktracelimit
[10]: src_backend_error.fetcherror.md#capturestacktrace
[11]: src_backend_error.fetcherror.md
[12]: src_backend_error.apperror.md#message
[13]: src_backend_error.apperror.md#name
[14]: src_backend_error.apperror.md#stack
[15]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[16]: src_backend_error.apperror.md#preparestacktrace
[17]: src_backend_error.apperror.md#stacktracelimit