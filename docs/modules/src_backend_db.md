[barker.api.hscc.bdpa.org][1] / src/backend/db

# Module: src/backend/db

## Table of contents

### Type aliases

- [IdItem][2]
- [IdItemArray][3]

### Functions

- [closeDb][4]
- [destroyDb][5]
- [getDb][6]
- [getDbClient][7]
- [idExists][8]
- [initializeDb][9]
- [itemToObjectId][10]
- [itemToStringId][11]
- [setClientAndDb][12]

## Type aliases

### IdItem

Ƭ **IdItem**\<T>: `WithId`\<unknown> | `string` | `T` | `Nullish`

#### Type parameters

| Name | Type            |
| :--- | :-------------- |
| `T`  | `T`: `ObjectId` |

#### Defined in

[src/backend/db.ts:108][13]

---

### IdItemArray

Ƭ **IdItemArray**\<T>: `WithId`\<unknown>\[] | `string`\[] | `T`\[] | `Nullish`

#### Type parameters

| Name | Type            |
| :--- | :-------------- |
| `T`  | `T`: `ObjectId` |

#### Defined in

[src/backend/db.ts:109][14]

## Functions

### closeDb

▸ **closeDb**(): `Promise`\<void>

Kills the MongoClient and closes any lingering database connections.

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/db.ts:49][15]

---

### destroyDb

▸ **destroyDb**(`db`): `Promise`\<void>

Destroys all collections in the database. Can be called multiple times safely.
Used primarily for testing purposes.

#### Parameters

| Name | Type |
| :--- | :--- |
| `db` | `Db` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/db.ts:68][16]

---

### getDb

▸ **getDb**(`params?`): `Promise`\<Db>

Lazily connects to the database once on-demand instead of immediately when the
app runs.

#### Parameters

| Name              | Type     |
| :---------------- | :------- |
| `params?`         | `Object` |
| `params.external` | `true`   |

#### Returns

`Promise`\<Db>

#### Defined in

[src/backend/db.ts:15][17]

---

### getDbClient

▸ **getDbClient**(`params?`): `Promise`\<MongoClient>

Returns the MongoClient instance used to connect to the database.

#### Parameters

| Name              | Type     | Description                                                    |
| :---------------- | :------- | :------------------------------------------------------------- |
| `params?`         | `Object` | if `{external: true}`, external Mongo connect URI will be used |
| `params.external` | `true`   | -                                                              |

#### Returns

`Promise`\<MongoClient>

#### Defined in

[src/backend/db.ts:40][18]

---

### idExists

▸ **idExists**(`collection`, `id`): `Promise`\<boolean>

Checks if an item with `id` exists within `collection`.

#### Parameters

| Name         | Type         |
| :----------- | :----------- |
| `collection` | `Collection` |
| `id`         | `ObjectId`   |

#### Returns

`Promise`\<boolean>

#### Defined in

[src/backend/db.ts:104][19]

---

### initializeDb

▸ **initializeDb**(`db`): `Promise`\<void>

Initializes the database collections and indices. This function is idempotent
and can be called without worry of data loss.

#### Parameters

| Name | Type |
| :--- | :--- |
| `db` | `Db` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/db.ts:83][20]

---

### itemToObjectId

▸ **itemToObjectId**\<T>(`item`): `T`

Reduces an `item` down to its `ObjectId` instance.

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | `T`: `ObjectId`<T> |

#### Parameters

| Name   | Type           |
| :----- | :------------- |
| `item` | [IdItem][2]<T> |

#### Returns

`T`

#### Defined in

[src/backend/db.ts:118][21]

▸ **itemToObjectId**\<T>(`item`): `T`\[]

Reduces an array of `item`s down to its `ObjectId` instances.

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | `T`: `ObjectId`<T> |

#### Parameters

| Name   | Type                |
| :----- | :------------------ |
| `item` | [IdItemArray][3]<T> |

#### Returns

`T`\[]

#### Defined in

[src/backend/db.ts:122][22]

---

### itemToStringId

▸ **itemToStringId**\<T>(`item`): `string`

Reduces an `item` down to the string representation of its `ObjectId` instance.

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | `T`: `ObjectId`<T> |

#### Parameters

| Name   | Type           |
| :----- | :------------- |
| `item` | [IdItem][2]<T> |

#### Returns

`string`

#### Defined in

[src/backend/db.ts:153][23]

▸ **itemToStringId**\<T>(`item`): `string`\[]

Reduces an array of `item`s down to the string representations of their
respective `ObjectId` instances.

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | `T`: `ObjectId`<T> |

#### Parameters

| Name   | Type                |
| :----- | :------------------ |
| `item` | [IdItemArray][3]<T> |

#### Returns

`string`\[]

#### Defined in

[src/backend/db.ts:158][24]

---

### setClientAndDb

▸ **setClientAndDb**(`(destructured)`): `void`

Sets the global db instance to something else. Used primarily for testing
purposes.

#### Parameters

| Name             | Type          |
| :--------------- | :------------ |
| `(destructured)` | `Object`      |
| ▶ `({ client })` | `MongoClient` |
| ▶ `({ db })`     | `Db`          |

#### Returns

`void`

#### Defined in

[src/backend/db.ts:58][25]

[1]: ../README.md
[2]: src_backend_db.md#iditem
[3]: src_backend_db.md#iditemarray
[4]: src_backend_db.md#closedb
[5]: src_backend_db.md#destroydb
[6]: src_backend_db.md#getdb
[7]: src_backend_db.md#getdbclient
[8]: src_backend_db.md#idexists
[9]: src_backend_db.md#initializedb
[10]: src_backend_db.md#itemtoobjectid
[11]: src_backend_db.md#itemtostringid
[12]: src_backend_db.md#setclientanddb
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L108
[14]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L109
[15]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L49
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L68
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L15
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L40
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L104
[20]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L83
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L118
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L122
[23]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L153
[24]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L158
[25]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/db.ts#L58
