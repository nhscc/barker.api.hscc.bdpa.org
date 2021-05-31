[barker.api.hscc.bdpa.org][1] / [src/backend/error][2] / ActivityGenerationError

# Class: ActivityGenerationError

[src/backend/error][2].ActivityGenerationError

## Hierarchy

- [_AppError_][3]

  ↳ **ActivityGenerationError**

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

\+ **new ActivityGenerationError**(`message?`: _string_):
[_ActivityGenerationError_][11]

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | _string_ |

**Returns:** [_ActivityGenerationError_][11]

Overrides: [AppError][3]

Defined in: [src/backend/error.ts:5][12]

## Properties

### message

• **message**: _string_

Inherited from: [AppError][3].[message][13]

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: _string_

Inherited from: [AppError][3].[name][14]

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: _string_

Inherited from: [AppError][3].[stack][15]

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`:
CallSite\[]) => _any_

Optional override for formatting stack traces

**`see`** [https://v8.dev/docs/stack-trace-api#customizing-stack-traces][16]

#### Type declaration

▸ (`err`: Error, `stackTraces`: CallSite\[]): _any_

#### Parameters

| Name          | Type       |
| :------------ | :--------- |
| `err`         | Error      |
| `stackTraces` | CallSite[] |

**Returns:** _any_

Inherited from: [AppError][3].[prepareStackTrace][17]

Defined in: node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: _number_

Inherited from: [AppError][3].[stackTraceLimit][18]

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
[4]: src_backend_error.activitygenerationerror.md#constructor
[5]: src_backend_error.activitygenerationerror.md#message
[6]: src_backend_error.activitygenerationerror.md#name
[7]: src_backend_error.activitygenerationerror.md#stack
[8]: src_backend_error.activitygenerationerror.md#preparestacktrace
[9]: src_backend_error.activitygenerationerror.md#stacktracelimit
[10]: src_backend_error.activitygenerationerror.md#capturestacktrace
[11]: src_backend_error.activitygenerationerror.md
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/error.ts#L5
[13]: src_backend_error.apperror.md#message
[14]: src_backend_error.apperror.md#name
[15]: src_backend_error.apperror.md#stack
[16]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[17]: src_backend_error.apperror.md#preparestacktrace
[18]: src_backend_error.apperror.md#stacktracelimit
