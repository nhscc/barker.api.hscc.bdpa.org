[barker.api.hscc.bdpa.org][1] / src/backend/error

# Module: src/backend/error

## Table of contents

### Classes

- [ActivityGenerationError][2]
- [AppError][3]
- [FetchError][4]
- [GuruMeditationError][5]
- [HookError][6]
- [IdTypeError][7]
- [KeyError][8]
- [NotAuthorizedError][9]
- [NotFoundError][10]
- [ValidationError][11]

### Variables

- [KeyTypeError][12]

### Functions

- [makeNamedError][13]

## Variables

### KeyTypeError

• `Const` **KeyTypeError**: _typeof_ [_KeyError_][8]

An alias of KeyError.

Defined in: node_modules/named-app-errors/dist/modules/index.d.ts:29

## Functions

### makeNamedError

▸ **makeNamedError**(`ErrorClass`: AnyClass, `name`: _string_): _void_

Defines a special `name` property on an error class that improves DX.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `ErrorClass` | AnyClass |
| `name`       | _string_ |

**Returns:** _void_

Defined in: node_modules/named-app-errors/dist/modules/index.d.ts:5

[1]: ../README.md
[2]: ../classes/src_backend_error.activitygenerationerror.md
[3]: ../classes/src_backend_error.apperror.md
[4]: ../classes/src_backend_error.fetcherror.md
[5]: ../classes/src_backend_error.gurumeditationerror.md
[6]: ../classes/src_backend_error.hookerror.md
[7]: ../classes/src_backend_error.idtypeerror.md
[8]: ../classes/src_backend_error.keyerror.md
[9]: ../classes/src_backend_error.notauthorizederror.md
[10]: ../classes/src_backend_error.notfounderror.md
[11]: ../classes/src_backend_error.validationerror.md
[12]: src_backend_error.md#keytypeerror
[13]: src_backend_error.md#makenamederror
