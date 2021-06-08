[barker.api.hscc.bdpa.org][1] / src/backend/middleware

# Module: src/backend/middleware

## Table of contents

### Variables

- [defaultConfig][2]

### Functions

- [wrapHandler][3]

## Variables

### defaultConfig

• `Const` **defaultConfig**: `PageConfig`

**`see`** [https://nextjs.org/docs/api-routes/api-middlewares#custom-config][4]

#### Defined in

[src/backend/middleware.ts:48][5]

## Functions

### wrapHandler

▸ **wrapHandler**(`handler`, `(destructured)`): `Promise`\<void>

Generic middleware "glue" to handle api endpoints with consistent behavior like
safe exception handling.

Passing `undefined` as `handler` or not calling `res.send()` in your handler
will trigger an `HTTP 501 Not Implemented` response. This can be used to to stub
out endpoints for later implementation.

#### Parameters

| Name             | Type                                                                    |
| :--------------- | :---------------------------------------------------------------------- |
| `handler`        | `undefined` \| (`params`: [NextApiState][6]) => `Promise`<void>         |
| `(destructured)` | [NextApiState][6] & { `apiVersion?`: `number` ; `methods`: `string`[] } |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/middleware.ts:60][7]

[1]: ../README.md
[2]: src_backend_middleware.md#defaultconfig
[3]: src_backend_middleware.md#wraphandler
[4]: https://nextjs.org/docs/api-routes/api-middlewares#custom-config
[5]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/middleware.ts#L48
[6]: types_global.md#nextapistate
[7]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/middleware.ts#L60
