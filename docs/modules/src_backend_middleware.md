[barker.api.hscc.bdpa.org][1] / src/backend/middleware

# Module: src/backend/middleware

## Table of contents

### Type aliases

- [AsyncHanCallback][2]
- [GenHanParams][3]

### Variables

- [config][4]

### Functions

- [handleEndpoint][5]
- [sendHttpContrivedError][6]

## Type aliases

### AsyncHanCallback

Ƭ **AsyncHanCallback**: (`params`: [_NextApiState_][7]) => _Promise_\<void>

#### Type declaration

▸ (`params`: [_NextApiState_][7]): _Promise_\<void>

#### Parameters

| Name     | Type                |
| :------- | :------------------ |
| `params` | [_NextApiState_][7] |

**Returns:** _Promise_\<void>

Defined in: [src/backend/middleware.ts:37][8]

---

### GenHanParams

Ƭ **GenHanParams**: [_NextApiState_][7] & { `apiVersion?`: _number_ ; `methods`:
_string_\[] }

Defined in: [src/backend/middleware.ts:38][9]

## Variables

### config

• `Const` **config**: _object_

#### Type declaration

| Name                       | Type     |
| :------------------------- | :------- |
| `api`                      | _object_ |
| `api.bodyParser`           | _object_ |
| `api.bodyParser.sizeLimit` | _number_ |

Defined in: [src/backend/middleware.ts:64][10]

## Functions

### handleEndpoint

▸ **handleEndpoint**(`fn`: [_AsyncHanCallback_][2], `(destructured)`:
[_GenHanParams_][3]): _Promise_\<void>

Generic middleware to handle any api endpoint. You can give it an empty async
handler function to trigger a 501 not implemented (to stub out API endpoints).

#### Parameters

| Name             | Type                    |
| :--------------- | :---------------------- |
| `fn`             | [_AsyncHanCallback_][2] |
| `(destructured)` | [_GenHanParams_][3]     |

**Returns:** _Promise_\<void>

Defined in: [src/backend/middleware.ts:73][11]

---

### sendHttpContrivedError

▸ **sendHttpContrivedError**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [src/backend/middleware.ts:53][12]

[1]: ../README.md
[2]: src_backend_middleware.md#asynchancallback
[3]: src_backend_middleware.md#genhanparams
[4]: src_backend_middleware.md#config
[5]: src_backend_middleware.md#handleendpoint
[6]: src_backend_middleware.md#sendhttpcontrivederror
[7]: types_global.md#nextapistate
[8]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/middleware.ts#L37
[9]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/middleware.ts#L38
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/middleware.ts#L64
[11]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/middleware.ts#L73
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/middleware.ts#L53
