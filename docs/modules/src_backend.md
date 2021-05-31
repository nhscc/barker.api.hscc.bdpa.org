[barker.api.hscc.bdpa.org][1] / src/backend

# Module: src/backend

## Table of contents

### Variables

- [DUMMY_KEY][2]
- [NULL_KEY][3]

### Functions

- [addToRequestLog][4]
- [generateActivity][5]
- [getApiKeys][6]
- [getBarksById][7]
- [isDueForContrivedError][8]
- [isKeyAuthentic][9]
- [isRateLimited][10]
- [searchBarks][11]

## Variables

### DUMMY_KEY

• `Const` **DUMMY_KEY**: `"12349b61-83a7-4036-b060-213784b491"`=
'12349b61-83a7-4036-b060-213784b491'

Defined in: [src/backend/index.ts:30][12]

---

### NULL_KEY

• `Const` **NULL_KEY**: `"00000000-0000-0000-0000-000000000000"`=
'00000000-0000-0000-0000-000000000000'

Defined in: [src/backend/index.ts:29][13]

## Functions

### addToRequestLog

▸ **addToRequestLog**(`(destructured)`: [_NextApiState_][14]): _Promise_\<void>

Note that this async function does not have to be awaited. It's fire and forget!

#### Parameters

| Name             | Type                 |
| :--------------- | :------------------- |
| `(destructured)` | [_NextApiState_][14] |

**Returns:** _Promise_\<void>

Defined in: [src/backend/index.ts:90][15]

---

### generateActivity

▸ **generateActivity**(`silent?`: _boolean_): _Promise_\<void>

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `silent` | _boolean_ | false         |

**Returns:** _Promise_\<void>

Defined in: [src/backend/index.ts:295][16]

---

### getApiKeys

▸ **getApiKeys**(): _Promise_<{ `key`: _string_ ; `owner`: _string_ }\[]>

**Returns:** _Promise_<{ `key`: _string_ ; `owner`: _string_ }\[]>

Defined in: [src/backend/index.ts:141][17]

---

### getBarksById

▸ **getBarksById**(`params`: { `ids`: ObjectId\[] ; `key`: _string_ }):
_Promise_\<undefined | never\[]>

#### Parameters

| Name         | Type       |
| :----------- | :--------- |
| `params`     | _object_   |
| `params.ids` | ObjectId[] |
| `params.key` | _string_   |

**Returns:** _Promise_\<undefined | never\[]>

Defined in: [src/backend/index.ts:56][18]

---

### isDueForContrivedError

▸ **isDueForContrivedError**(): _boolean_

**Returns:** _boolean_

Defined in: [src/backend/index.ts:130][19]

---

### isKeyAuthentic

▸ **isKeyAuthentic**(`key`: _string_): _Promise_\<boolean>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `key` | _string_ |

**Returns:** _Promise_\<boolean>

Defined in: [src/backend/index.ts:76][20]

---

### isRateLimited

▸ **isRateLimited**(`req`: NextApiRequest): _Promise_<{ `limited`: _boolean_ =
!!limited; `retryAfter`: _number_ }>

#### Parameters

| Name  | Type           |
| :---- | :------------- |
| `req` | NextApiRequest |

**Returns:** _Promise_<{ `limited`: _boolean_ = !!limited; `retryAfter`:
_number_ }>

Defined in: [src/backend/index.ts:105][21]

---

### searchBarks

▸ **searchBarks**(`params`: { `after`: ObjectId | `null` ; `key`: _string_ ;
`match`: { \[specifier: string]: _string_ | _number_ | ObjectId | {
\[subspecifier in "$gt" | "$lt" | "$gte" | "$lte"]?: string | number}; } ;
`regexMatch`: { \[specifier: string]: _string_ | ObjectId; } }):
_Promise_\<unknown\[]>

#### Parameters

| Name                | Type               |
| :------------------ | :----------------- |
| `params`            | _object_           |
| `params.after`      | ObjectId \| `null` |
| `params.key`        | _string_           |
| `params.match`      | _object_           |
| `params.regexMatch` | _object_           |

**Returns:** _Promise_\<unknown\[]>

Defined in: [src/backend/index.ts:156][22]

[1]: ../README.md
[2]: src_backend.md#dummy_key
[3]: src_backend.md#null_key
[4]: src_backend.md#addtorequestlog
[5]: src_backend.md#generateactivity
[6]: src_backend.md#getapikeys
[7]: src_backend.md#getbarksbyid
[8]: src_backend.md#isdueforcontrivederror
[9]: src_backend.md#iskeyauthentic
[10]: src_backend.md#isratelimited
[11]: src_backend.md#searchbarks
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L30
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L29
[14]: types_global.md#nextapistate
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L90
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L295
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L141
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L56
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L130
[20]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L76
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L105
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/src/backend/index.ts#L156
