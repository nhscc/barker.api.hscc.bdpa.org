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

| Name    | Type                              |
| :------ | :-------------------------------- |
| `barks` | `WithId`<[`InternalBark`][5]>[]   |
| `info`  | `WithId`<[`InternalInfo`][6]>     |
| `keys`  | `WithId`<[`InternalApiKey`][7]>[] |
| `users` | `WithId`<[`InternalUser`][8]>[]   |

#### Defined in

[test/db.ts:30][9]

## Variables

### dummyDbData

• `Const` **dummyDbData**: [`DummyDbData`][2]

#### Defined in

[test/db.ts:40][10]

## Functions

### hydrateDb

▸ **hydrateDb**(`db`, `data`): `Promise`<[`DummyDbData`][2]>

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `db`   | `Db`               |
| `data` | [`DummyDbData`][2] |

#### Returns

`Promise`<[`DummyDbData`][2]>

#### Defined in

[test/db.ts:146][11]

---

### setupTestDb

▸ **setupTestDb**(`defer?`): `Object`

Setup a test version of the database using jest lifecycle hooks.

#### Parameters

| Name    | Type      | Default value | Description                                                                                                                                                                                                     |
| :------ | :-------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defer` | `boolean` | `false`       | If `true`, `beforeEach` and `afterEach` lifecycle hooks are skipped and the database is initialized and hydrated once before all tests are run. **In this mode, all tests will share the same database state!** |

#### Returns

`Object`

| Name                | Type                                                            |
| :------------------ | :-------------------------------------------------------------- |
| `getDb`             | (`params?`: { `external`: `true` }) => `Promise`<`Db`>          |
| `getDbClient`       | (`params?`: { `external`: `true` }) => `Promise`<`MongoClient`> |
| `getNewClientAndDb` | () => `Promise`<`Object`>                                       |

#### Defined in

[test/db.ts:185][12]

[1]: ../README.md
[2]: test_db.md#dummydbdata
[3]: test_db.md#hydratedb
[4]: test_db.md#setuptestdb
[5]: types_global.md#internalbark
[6]: types_global.md#internalinfo
[7]: types_global.md#internalapikey
[8]: types_global.md#internaluser
[9]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/db.ts#L30
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/db.ts#L40
[11]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/db.ts#L146
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/test/db.ts#L185
