[barker.api.hscc.bdpa.org][1] / lib/next-respond

# Module: lib/next-respond

## Table of contents

### Functions

- [sendGenericHttpResponse][2]
- [sendHttpBadMethod][3]
- [sendHttpBadRequest][4]
- [sendHttpError][5]
- [sendHttpErrorResponse][6]
- [sendHttpNotFound][7]
- [sendHttpOk][8]
- [sendHttpRateLimited][9]
- [sendHttpSuccessResponse][10]
- [sendHttpTooLarge][11]
- [sendHttpUnauthenticated][12]
- [sendHttpUnauthorized][13]
- [sendNotImplementedError][14]

## Functions

### sendGenericHttpResponse

▸ **sendGenericHttpResponse**(`res`: NextApiResponse, `statusCode`:
[_HttpStatusCode_][15], `responseJson?`: _Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `statusCode`    | [_HttpStatusCode_][15]    |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:4][16]

---

### sendHttpBadMethod

▸ **sendHttpBadMethod**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:76][17]

---

### sendHttpBadRequest

▸ **sendHttpBadRequest**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:36][18]

---

### sendHttpError

▸ **sendHttpError**(`res`: NextApiResponse, `responseJson?`: _Record_\<string,
unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:106][19]

---

### sendHttpErrorResponse

▸ **sendHttpErrorResponse**(`res`: NextApiResponse, `statusCode`:
[_HttpStatusCode_][15], `responseJson`: _Record_\<string, unknown> & { `error`:
_string_ }): [_ErrorJsonResponse_][20]

#### Parameters

| Name           | Type                                              |
| :------------- | :------------------------------------------------ |
| `res`          | NextApiResponse                                   |
| `statusCode`   | [_HttpStatusCode_][15]                            |
| `responseJson` | _Record_<string, unknown> & { `error`: _string_ } |

**Returns:** [_ErrorJsonResponse_][20]

Defined in: [lib/next-respond/index.ts:22][21]

---

### sendHttpNotFound

▸ **sendHttpNotFound**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:66][22]

---

### sendHttpOk

▸ **sendHttpOk**(`res`: NextApiResponse, `responseJson?`: _Record_\<string,
unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:32][23]

---

### sendHttpRateLimited

▸ **sendHttpRateLimited**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:96][24]

---

### sendHttpSuccessResponse

▸ **sendHttpSuccessResponse**(`res`: NextApiResponse, `statusCode`:
[_HttpStatusCode_][15], `responseJson?`: _Record_\<string, unknown>):
[_SuccessJsonResponse_][25]

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `statusCode`    | [_HttpStatusCode_][15]    |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** [_SuccessJsonResponse_][25]

Defined in: [lib/next-respond/index.ts:12][26]

---

### sendHttpTooLarge

▸ **sendHttpTooLarge**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:86][27]

---

### sendHttpUnauthenticated

▸ **sendHttpUnauthenticated**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:46][28]

---

### sendHttpUnauthorized

▸ **sendHttpUnauthorized**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:56][29]

---

### sendNotImplementedError

▸ **sendNotImplementedError**(`res`: NextApiResponse, `responseJson?`:
_Record_\<string, unknown>): _void_

#### Parameters

| Name            | Type                      |
| :-------------- | :------------------------ |
| `res`           | NextApiResponse           |
| `responseJson?` | _Record_<string, unknown> |

**Returns:** _void_

Defined in: [lib/next-respond/index.ts:116][30]

[1]: ../README.md
[2]: lib_next_respond.md#sendgenerichttpresponse
[3]: lib_next_respond.md#sendhttpbadmethod
[4]: lib_next_respond.md#sendhttpbadrequest
[5]: lib_next_respond.md#sendhttperror
[6]: lib_next_respond.md#sendhttperrorresponse
[7]: lib_next_respond.md#sendhttpnotfound
[8]: lib_next_respond.md#sendhttpok
[9]: lib_next_respond.md#sendhttpratelimited
[10]: lib_next_respond.md#sendhttpsuccessresponse
[11]: lib_next_respond.md#sendhttptoolarge
[12]: lib_next_respond.md#sendhttpunauthenticated
[13]: lib_next_respond.md#sendhttpunauthorized
[14]: lib_next_respond.md#sendnotimplementederror
[15]: lib_next_isomorphic_redirect_types.md#httpstatuscode
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L4
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L76
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L36
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L106
[20]: lib_next_respond_types.md#errorjsonresponse
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L22
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L66
[23]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L32
[24]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L96
[25]: lib_next_respond_types.md#successjsonresponse
[26]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L12
[27]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L86
[28]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L46
[29]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L56
[30]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/lib/next-respond/index.ts#L116
