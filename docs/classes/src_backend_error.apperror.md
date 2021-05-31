[barker.api.hscc.bdpa.org][1] / [src/backend/error][2] / AppError

# Class: AppError

[src/backend/error][2].AppError

## Hierarchy

- _Error_

  ↳ **AppError**

  ↳↳ [_ActivityGenerationError_][3]

  ↳↳ [_IdTypeError_][4]

  ↳↳ [_GuruMeditationError_][5]

  ↳↳ [_HookError_][6]

  ↳↳ [_FetchError_][7]

  ↳↳ [_NotAuthorizedError_][8]

  ↳↳ [_NotFoundError_][9]

  ↳↳ [_KeyError_][10]

  ↳↳ [_ValidationError_][11]

## Table of contents

### Constructors

- [constructor][12]

### Properties

- [message][13]
- [name][14]
- [stack][15]
- [prepareStackTrace][16]
- [stackTraceLimit][17]

### Methods

- [captureStackTrace][18]

## Constructors

### constructor

\+ **new AppError**(`message?`: _string_): [_AppError_][19]

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | _string_ |

**Returns:** [_AppError_][19]

Inherited from: Error.constructor

Defined in: node_modules/typescript/lib/lib.es5.d.ts:978

## Properties

### message

• **message**: _string_

Inherited from: Error.message

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: _string_

Inherited from: Error.name

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: _string_

Inherited from: Error.stack

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`:
CallSite\[]) => _any_

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][20]

#### Type declaration

▸ (`err`: Error, `stackTraces`: CallSite\[]): _any_

#### Parameters

| Name          | Type       |
| :------------ | :--------- |
| `err`         | Error      |
| `stackTraces` | CallSite[] |

**Returns:** _any_

Inherited from: Error.prepareStackTrace

Defined in: node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: _number_

Inherited from: Error.stackTraceLimit

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

Inherited from: Error.captureStackTrace

Defined in: node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/src_backend_error.md
[3]: src_backend_error.activitygenerationerror.md
[4]: src_backend_error.idtypeerror.md
[5]: src_backend_error.gurumeditationerror.md
[6]: src_backend_error.hookerror.md
[7]: src_backend_error.fetcherror.md
[8]: src_backend_error.notauthorizederror.md
[9]: src_backend_error.notfounderror.md
[10]: src_backend_error.keyerror.md
[11]: src_backend_error.validationerror.md
[12]: src_backend_error.apperror.md#constructor
[13]: src_backend_error.apperror.md#message
[14]: src_backend_error.apperror.md#name
[15]: src_backend_error.apperror.md#stack
[16]: src_backend_error.apperror.md#preparestacktrace
[17]: src_backend_error.apperror.md#stacktracelimit
[18]: src_backend_error.apperror.md#capturestacktrace
[19]: src_backend_error.apperror.md
[20]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
