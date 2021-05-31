[barker.api.hscc.bdpa.org][1] / src/backend/db

# Module: src/backend/db

## Table of contents

### Functions

- [closeDb][2]
- [destroyDb][3]
- [getDb][4]
- [getDbClient][5]
- [initializeDb][6]
- [setClientAndDb][7]

## Functions

### closeDb

▸ **closeDb**(): _Promise_\<void>

Used to kill the MongoClient and close any lingering database connections.

**Returns:** _Promise_\<void>

Defined in: [src/backend/db.ts:47][8]

---

### destroyDb

▸ **destroyDb**(`db`: Db): _Promise_\<void>

Destroys all collections in the database. Can be called multiple times safely.

#### Parameters

| Name | Type |
| :--- | :--- |
| `db` | Db   |

**Returns:** _Promise_\<void>

Defined in: [src/backend/db.ts:65][9]

---

### getDb

▸ **getDb**(`params?`: { `external`: `true` }): _Promise_\<Db>

Used to lazily create the database once on-demand instead of immediately when
the app runs.

#### Parameters

| Name              | Type     |
| :---------------- | :------- |
| `params?`         | _object_ |
| `params.external` | `true`   |

**Returns:** _Promise_\<Db>

Defined in: [src/backend/db.ts:11][10]

---

### getDbClient

▸ **getDbClient**(`params?`: { `external`: `true` }): _Promise_\<MongoClient>

Used to lazily create the database once on-demand instead of immediately when
the app runs. Returns the MongoClient instance used to connect to the database.

#### Parameters

| Name              | Type     | Description                                                    |
| :---------------- | :------- | :------------------------------------------------------------- |
| `params?`         | _object_ | If `{external: true}`, external Mongo connect URI will be used |
| `params.external` | `true`   | -                                                              |

**Returns:** _Promise_\<MongoClient>

Defined in: [src/backend/db.ts:38][11]

---

### initializeDb

▸ **initializeDb**(`db`: Db): _Promise_\<void>

This function is idempotent and can be called without worry of data loss.

#### Parameters

| Name | Type |
| :--- | :--- |
| `db` | Db   |

**Returns:** _Promise_\<void>

Defined in: [src/backend/db.ts:79][12]

---

### setClientAndDb

▸ **setClientAndDb**(`(destructured)`: { `client`: MongoClient ; `db`: Db }):
_void_

Used for testing purposes. Sets the global db instance to something else.

#### Parameters

| Name             | Type        |
| :--------------- | :---------- |
| `(destructured)` | _object_    |
| ▶ `({ client })` | MongoClient |
| ▶ `({ db })`     | Db          |

**Returns:** _void_

Defined in: [src/backend/db.ts:55][13]

[1]: ../README.md
[2]: src_backend_db.md#closedb
[3]: src_backend_db.md#destroydb
[4]: src_backend_db.md#getdb
[5]: src_backend_db.md#getdbclient
[6]: src_backend_db.md#initializedb
[7]: src_backend_db.md#setclientanddb
[8]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/db.ts#L47
[9]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/db.ts#L65
[10]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/db.ts#L11
[11]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/db.ts#L38
[12]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/db.ts#L79
[13]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/37281dd/src/backend/db.ts#L55
