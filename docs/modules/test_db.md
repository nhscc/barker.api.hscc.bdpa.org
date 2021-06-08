[barker.api.hscc.bdpa.org][1] / test/db

# Module: test/db

## Table of contents

### Type aliases

- [DummyDbData][2]

### Variables

- [dummyDbData][2]

### Functions

- [hydrateDb][3]
- [setupTestDb][4]

## Type aliases

### DummyDbData

Ƭ **DummyDbData**: `Object`

#### Type declaration

| Name    | Type                            |
| :------ | :------------------------------ |
| `barks` | `WithId`<[InternalBark][5]>[]   |
| `info`  | `WithId`<[InternalInfo][6]>     |
| `keys`  | `WithId`<[InternalApiKey][7]>[] |
| `users` | `WithId`<[InternalUser][8]>[]   |

#### Defined in

[test/db.ts:28][9]

## Variables

### dummyDbData

• `Const` **dummyDbData**: [DummyDbData][2]

#### Defined in

[test/db.ts:35][10]

## Functions

### hydrateDb

▸ **hydrateDb**(`db`, `data`): `Promise`<[DummyDbData][2]>

#### Parameters

| Name   | Type             |
| :----- | :--------------- |
| `db`   | `Db`             |
| `data` | [DummyDbData][2] |

#### Returns

`Promise`<[DummyDbData][2]>

#### Defined in

[test/db.ts:136][11]

---

### setupTestDb

▸ **setupTestDb**(): `Object`

#### Returns

`Object`

| Name                | Type                                                          |
| :------------------ | :------------------------------------------------------------ |
| `getDb`             | (`params?`: { `external`: `true` }) => `Promise`<Db>          |
| `getDbClient`       | (`params?`: { `external`: `true` }) => `Promise`<MongoClient> |
| `getNewClientAndDb` | () => `Promise`<`Object`>                                     |

#### Defined in

[test/db.ts:168][12]

[1]: ../README.md
[2]: test_db.md#dummydbdata
[3]: test_db.md#hydratedb
[4]: test_db.md#setuptestdb
[5]: types_global.md#internalbark
[6]: types_global.md#internalinfo
[7]: types_global.md#internalapikey
[8]: types_global.md#internaluser
[9]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/db.ts#L28
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/db.ts#L35
[11]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/db.ts#L136
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/test/db.ts#L168
