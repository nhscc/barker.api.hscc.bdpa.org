[barker.api.hscc.bdpa.org][1] / types/global

# Module: types/global

## Table of contents

### Interfaces

- [BarkId][2]
- [FollowedId][3]
- [PackmateId][4]
- [UnixEpochMs][5]
- [UserId][6]

### Type aliases

- [ApiKey][7]
- [CorpusData][8]
- [CorpusDialogLine][9]
- [InternalBark][10]
- [InternalInfo][11]
- [InternalUser][12]
- [LimitedLogEntry][13]
- [NextApiState][14]
- [RequestLogEntry][15]

## Type aliases

### ApiKey

Ƭ **ApiKey**: _object_

The shape of an API key.

#### Type declaration

| Name    | Type     |
| :------ | :------- |
| `key`   | _string_ |
| `owner` | _string_ |

Defined in: [types/global.d.ts:179][16]

---

### CorpusData

Ƭ **CorpusData**: _object_

The shape of precomputed conversation corpus data.

#### Type declaration

| Name        | Type                        |
| :---------- | :-------------------------- |
| `dialogs`   | [_CorpusDialogLine_][9][][] |
| `usernames` | _string_[]                  |

Defined in: [types/global.d.ts:214][17]

---

### CorpusDialogLine

Ƭ **CorpusDialogLine**: _object_

The shape of a single line of precomputed conversation corpus data.

#### Type declaration

| Name    | Type           |
| :------ | :------------- |
| `actor` | `"A"` \| `"B"` |
| `line`  | _string_       |

Defined in: [types/global.d.ts:222][18]

---

### InternalBark

Ƭ **InternalBark**: _object_

The shape of a Bark stored in MongoDb.

#### Type declaration

| Name                   | Type                    | Description                                                                                                                                            |
| :--------------------- | :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `barkbackTo`           | [_BarkId_][2] \| `null` | The ID of the Bark this Bark was created in response to.                                                                                               |
| `barkbacks`            | _number_                | Integer number of barkbacks this Bark has received.                                                                                                    |
| `content`              | _string_                | The utf-8 content of this Bark.                                                                                                                        |
| `createdAt`            | [_UnixEpochMs_][5]      | When this bark was created creation (milliseconds since unix epoch).                                                                                   |
| `deleted`              | _boolean_               | If `true`, the user is for all intents and purposes non-existent in the system. **`default`** false                                                    |
| `likes`                | _number_                | Integer number of likes this Bark has received.                                                                                                        |
| `meta`                 | _object_                | Metadata information only relevant to the server runtime and completely opaque to API consumers.                                                       |
| `meta.barkbackability` | _number_                | User Influence _ 0.10 + Bark "Barkbackability" _ 0.15 + .15 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user. |
| `meta.likeability`     | _number_                | User Influence _ 0.15 + Bark Likeability _ 0.25 + .1 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user.        |
| `meta.rebarkability`   | _number_                | User Influence _ 0.10 + Bark "Rebarkability" _ 0.20 + .1 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user.    |
| `owner`                | [_UserId_][6]           | The ID of the user that created and owns this Bark.                                                                                                    |
| `private`              | _boolean_               | If `true`, this Bark should only be visible to authorized users. **`default`** false                                                                   |
| `rebarkOf`             | [_BarkId_][2] \| `null` | The ID of the Bark this Bark was copied ("rebarked") from.                                                                                             |
| `rebarks`              | _number_                | Integer number of rebarks this Bark has received.                                                                                                      |

Defined in: [types/global.d.ts:34][19]

---

### InternalInfo

Ƭ **InternalInfo**: _object_

The shape of API metadata stored in MongoDb.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `totalBarks` | _number_ |
| `totalUsers` | _number_ |

Defined in: [types/global.d.ts:26][20]

---

### InternalUser

Ƭ **InternalUser**: _object_

The shape of a user stored in MongoDb.

#### Type declaration

| Name                 | Type               | Description                                                                                                                                     |
| :------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `bookmarked`         | [_BarkId_][2][]    | A list of Bark IDs bookmarked by this user.                                                                                                     |
| `deleted`            | _boolean_          | If `true`, the user is for all intents and purposes non-existent in the system. **`default`** false                                             |
| `email`              | _string_           | Email address                                                                                                                                   |
| `following`          | [_UserId_][6][]    | A list of user IDs this user is following.                                                                                                      |
| `liked`              | [_BarkId_][2][]    | A list of Bark IDs that this user has liked.                                                                                                    |
| `meta`               | _object_           | Metadata information only relevant to the server runtime and completely opaque to API consumers.                                                |
| `meta.followability` | _number_           | Max percentage of the generated user base that will _eventually_ follow this user.                                                              |
| `meta.influence`     | _number_           | User Influence _ 0.15 + Bark Likeability _ 0.25 + .1 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user. |
| `name`               | _string_           | User first, full, etc name                                                                                                                      |
| `packmates`          | [_UserId_][6][]    | A list of user IDs in this user's pack.                                                                                                         |
| `phone`              | _string_ \| `null` | Phone number                                                                                                                                    |
| `username`           | _string_           | Username. Must be unique in the system.                                                                                                         |

Defined in: [types/global.d.ts:114][21]

---

### LimitedLogEntry

Ƭ **LimitedLogEntry**: { `ip`: _string_ | `null` ; `key?`: _never_ ; `until`:
_number_ } | { `ip?`: _never_ ; `key`: _string_ | `null` ; `until`: _number_ }

The shape of a limited log entry.

Defined in: [types/global.d.ts:199][22]

---

### NextApiState

Ƭ **NextApiState**\<Payload>: _object_

A type combining NextApiRequest and NextApiResponse.

#### Type parameters

| Name      | Default   |
| :-------- | :-------- |
| `Payload` | _unknown_ |

#### Type declaration

| Name  | Type                       |
| :---- | :------------------------- |
| `req` | NextApiRequest             |
| `res` | _NextApiResponse_<Payload> |

Defined in: [types/global.d.ts:18][23]

---

### RequestLogEntry

Ƭ **RequestLogEntry**: _object_

The shape of a request log entry.

#### Type declaration

| Name            | Type               |
| :-------------- | :----------------- |
| `ip`            | _string_ \| `null` |
| `key`           | _string_ \| `null` |
| `method`        | _string_ \| `null` |
| `resStatusCode` | _number_           |
| `route`         | _string_ \| `null` |
| `time`          | _number_           |

Defined in: [types/global.d.ts:187][24]

[1]: ../README.md
[2]: ../interfaces/types_global.barkid.md
[3]: ../interfaces/types_global.followedid.md
[4]: ../interfaces/types_global.packmateid.md
[5]: ../interfaces/types_global.unixepochms.md
[6]: ../interfaces/types_global.userid.md
[7]: types_global.md#apikey
[8]: types_global.md#corpusdata
[9]: types_global.md#corpusdialogline
[10]: types_global.md#internalbark
[11]: types_global.md#internalinfo
[12]: types_global.md#internaluser
[13]: types_global.md#limitedlogentry
[14]: types_global.md#nextapistate
[15]: types_global.md#requestlogentry
[16]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L179
[17]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L214
[18]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L222
[19]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L34
[20]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L26
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L114
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L199
[23]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L18
[24]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/08a500c/types/global.d.ts#L187
