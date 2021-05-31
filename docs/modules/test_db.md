[barker.api.hscc.bdpa.org][1] / test/db

# Module: test/db

## Table of contents

### Type aliases

- [DummyDbData][2]
- [HydratedDummyDbData][3]

### Variables

- [EXPAND_RESULTS_BY_MULT][4]
- [unhydratedDummyDbData][5]

### Functions

- [hydrateDb][6]
- [setupJest][7]

## Type aliases

### DummyDbData

Ƭ **DummyDbData**: _object_

#### Type declaration

| Name    | Type                   |
| :------ | :--------------------- |
| `barks` | [_InternalBark_][8][]  |
| `info`  | [_InternalInfo_][9]    |
| `keys`  | [_ApiKey_][10][]       |
| `users` | [_InternalUser_][11][] |

Defined in: [test/db.ts:27][12]

---

### HydratedDummyDbData

Ƭ **HydratedDummyDbData**: { \[P in keyof DummyDbData]: DummyDbData\[P] extends
infer T\[] | undefined ? WithId\<T>\[] : WithId\<DummyDbData\[P]>}

Defined in: [test/db.ts:34][13]

## Variables

### EXPAND_RESULTS_BY_MULT

• `Const` **EXPAND_RESULTS_BY_MULT**: `2.5`= 2.5

Defined in: [test/db.ts:25][14]

---

### unhydratedDummyDbData

• `Const` **unhydratedDummyDbData**: [_DummyDbData_][2]

Defined in: [test/db.ts:40][15]

## Functions

### hydrateDb

▸ **hydrateDb**(`db`: Db, `data`: [_DummyDbData_][2]):
_Promise_<[_HydratedDummyDbData_][3]>

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `db`   | Db                 |
| `data` | [_DummyDbData_][2] |

**Returns:** _Promise_<[_HydratedDummyDbData_][3]>

Defined in: [test/db.ts:64][16]

---

### setupJest

▸ **setupJest**(): _object_

**Returns:** _object_

| Name                | Type                                                          |
| :------------------ | :------------------------------------------------------------ |
| `getDb`             | (`params?`: { `external`: `true` }) => _Promise_<Db>          |
| `getDbClient`       | (`params?`: { `external`: `true` }) => _Promise_<MongoClient> |
| `getHydratedData`   | () => [_HydratedDummyDbData_][3]                              |
| `getNewClientAndDb` | () => _Promise_<{ `client`: _MongoClient_ ; `db`: _Db_ }>     |

Defined in: [test/db.ts:112][17]

[1]: ../README.md
[2]: test_db.md#dummydbdata
[3]: test_db.md#hydrateddummydbdata
[4]: test_db.md#expand_results_by_mult
[5]: test_db.md#unhydrateddummydbdata
[6]: test_db.md#hydratedb
[7]: test_db.md#setupjest
[8]: types_global.md#internalbark
[9]: types_global.md#internalinfo
[10]: types_global.md#apikey
[11]: types_global.md#internaluser
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/test/db.ts#L27
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/test/db.ts#L34
[14]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/test/db.ts#L25
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/test/db.ts#L40
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/test/db.ts#L64
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/test/db.ts#L112
