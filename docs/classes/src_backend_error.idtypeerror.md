[barker.api.hscc.bdpa.org][1] / [src/backend/error][2] / IdTypeError

# Class: IdTypeError\<T>

[src/backend/error][2].IdTypeError

## Type parameters

| Name | Default              |
| :--- | :------------------- |
| `T`  | _string_ \| _number_ |

## Hierarchy

- [_AppError_][3]

  ↳ **IdTypeError**

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

\+ **new IdTypeError**\<T>(`id?`: T): [_IdTypeError_][11]\<T>

#### Type parameters

| Name | Default              |
| :--- | :------------------- |
| `T`  | _string_ \| _number_ |

#### Parameters

| Name  | Type |
| :---- | :--- |
| `id?` | T    |

**Returns:** [_IdTypeError_][11]\<T>

Overrides: [AppError][3]

Defined in: [src/backend/error.ts:13][12]

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
[4]: src_backend_error.idtypeerror.md#constructor
[5]: src_backend_error.idtypeerror.md#message
[6]: src_backend_error.idtypeerror.md#name
[7]: src_backend_error.idtypeerror.md#stack
[8]: src_backend_error.idtypeerror.md#preparestacktrace
[9]: src_backend_error.idtypeerror.md#stacktracelimit
[10]: src_backend_error.idtypeerror.md#capturestacktrace
[11]: src_backend_error.idtypeerror.md
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/error.ts#L13
[13]: src_backend_error.apperror.md#message
[14]: src_backend_error.apperror.md#name
[15]: src_backend_error.apperror.md#stack
[16]: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
[17]: src_backend_error.apperror.md#preparestacktrace
[18]: src_backend_error.apperror.md#stacktracelimit
