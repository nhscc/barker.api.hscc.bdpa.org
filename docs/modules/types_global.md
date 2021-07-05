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

- [CorpusData][7]
- [CorpusDialogLine][8]
- [InternalApiKey][9]
- [InternalBark][10]
- [InternalInfo][11]
- [InternalLimitedLogEntry][12]
- [InternalRequestLogEntry][13]
- [InternalUser][14]
- [NewBark][15]
- [NewUser][16]
- [NextApiState][17]
- [PatchUser][18]
- [PublicBark][19]
- [PublicUser][20]

## Type aliases

### CorpusData

Ƭ **CorpusData**: `Object`

The shape of precomputed conversation corpus data.

#### Type declaration

| Name        | Type                        |
| :---------- | :-------------------------- |
| `dialogs`   | [`CorpusDialogLine`][8][][] |
| `usernames` | `string`[]                  |

#### Defined in

[types/global.d.ts:242][21]

---

### CorpusDialogLine

Ƭ **CorpusDialogLine**: `Object`

The shape of a single line of precomputed conversation corpus data.

#### Type declaration

| Name    | Type           |
| :------ | :------------- |
| `actor` | `"A"` \| `"B"` |
| `line`  | `string`       |

#### Defined in

[types/global.d.ts:250][22]

---

### InternalApiKey

Ƭ **InternalApiKey**: `Object`

The shape of an API key.

#### Type declaration

| Name    | Type     |
| :------ | :------- |
| `key`   | `string` |
| `owner` | `string` |

#### Defined in

[types/global.d.ts:258][23]

---

### InternalBark

Ƭ **InternalBark**: `Object`

The shape of a Bark stored in MongoDb.

#### Type declaration

| Name                   | Type                    | Description                                                                                                                                            |
| :--------------------- | :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `barkbackTo`           | [`BarkId`][2] \| `null` | The ID of the Bark this Bark was created in response to.                                                                                               |
| `content`              | `string`                | The utf-8 content of this Bark.                                                                                                                        |
| `createdAt`            | [`UnixEpochMs`][5]      | When this bark was created creation (milliseconds since unix epoch).                                                                                   |
| `deleted`              | `boolean`               | If `true`, the user is for all intents and purposes non-existent in the system. **`default`** false                                                    |
| `likes`                | [`UserId`][6][]         | A list of user IDs that liked this Bark.                                                                                                               |
| `meta`                 | `Object`                | Metadata information only relevant to the server runtime and completely opaque to API consumers.                                                       |
| `meta.barkbackability` | `number`                | User Influence × 0.10 + Bark "Barkbackability" × 0.15 + .15 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user. |
| `meta.creator`         | `string`                | The API key responsible for creating this Bark.                                                                                                        |
| `meta.likeability`     | `number`                | User Influence × 0.15 + Bark Likeability × 0.25 + .1 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user.        |
| `meta.rebarkability`   | `number`                | User Influence × 0.10 + Bark "Rebarkability" × 0.20 + .1 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user.    |
| `owner`                | [`UserId`][6]           | The ID of the user that created and owns this Bark.                                                                                                    |
| `private`              | `boolean`               | If `true`, this Bark should only be visible to authorized users. **`default`** false                                                                   |
| `rebarkOf`             | [`BarkId`][2] \| `null` | The ID of the Bark this Bark was copied ("rebarked") from.                                                                                             |
| `totalBarkbacks`       | `number`                | Integer number of barkbacks this Bark has received. We'll cache this data instead of calculating it via the aggregation for performance reasons.       |
| `totalLikes`           | `number`                | Integer number of likes this Bark has received. We'll cache this data instead of calculating it via the aggregation for performance reasons.           |
| `totalRebarks`         | `number`                | Integer number of rebarks this Bark has received. We'll cache this data instead of calculating it via the aggregation for performance reasons.         |

#### Defined in

[types/global.d.ts:34][24]

---

### InternalInfo

Ƭ **InternalInfo**: `Object`

The shape of API metadata stored in MongoDb.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `totalBarks` | `number` |
| `totalUsers` | `number` |

#### Defined in

[types/global.d.ts:26][25]

---

### InternalLimitedLogEntry

Ƭ **InternalLimitedLogEntry**: { `ip`: `string` | `null` ; `key?`: `never` ;
`until`: `number` } | { `ip?`: `never` ; `key`: `string` | `null` ; `until`:
`number` }

The shape of a limited log entry.

#### Defined in

[types/global.d.ts:278][26]

---

### InternalRequestLogEntry

Ƭ **InternalRequestLogEntry**: `Object`

The shape of a request log entry.

#### Type declaration

| Name            | Type               |
| :-------------- | :----------------- |
| `ip`            | `string` \| `null` |
| `key`           | `string` \| `null` |
| `method`        | `string` \| `null` |
| `resStatusCode` | `number`           |
| `route`         | `string` \| `null` |
| `time`          | `number`           |

#### Defined in

[types/global.d.ts:266][27]

---

### InternalUser

Ƭ **InternalUser**: `Object`

The shape of a user stored in MongoDb.

#### Type declaration

| Name                 | Type               | Description                                                                                                                                     |
| :------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `bookmarked`         | [`BarkId`][2][]    | A list of Bark IDs bookmarked by this user.                                                                                                     |
| `deleted`            | `boolean`          | If `true`, the user is for all intents and purposes non-existent in the system. **`default`** false                                             |
| `email`              | `string`           | Email address                                                                                                                                   |
| `following`          | [`UserId`][6][]    | A list of user IDs this user is following.                                                                                                      |
| `liked`              | [`BarkId`][2][]    | A list of Bark IDs that this user has liked.                                                                                                    |
| `meta`               | `Object`           | Metadata information only relevant to the server runtime and completely opaque to API consumers.                                                |
| `meta.creator`       | `string`           | The API key responsible for creating this Bark.                                                                                                 |
| `meta.followability` | `number`           | Max percentage of the generated user base that will _eventually_ follow this user.                                                              |
| `meta.influence`     | `number`           | User Influence × 0.15 + Bark Likeability × 0.25 + .1 Pack Bonus = percent chance of a generated follower liking a specific Bark from this user. |
| `name`               | `string`           | User first, full, etc name                                                                                                                      |
| `packmates`          | [`UserId`][6][]    | A list of user IDs in this user's pack.                                                                                                         |
| `phone`              | `string` \| `null` | Phone number                                                                                                                                    |
| `username`           | `string`           | Username. Must be unique in the system.                                                                                                         |

#### Defined in

[types/global.d.ts:125][28]

---

### NewBark

Ƭ **NewBark**: `Pick`<[`InternalBark`][10], `"owner"` | `"content"` |
`"private"` | `"barkbackTo"` | `"rebarkOf"`>

The shape of a newly received Bark.

#### Defined in

[types/global.d.ts:224][29]

---

### NewUser

Ƭ **NewUser**: `Pick`<[`InternalUser`][14], `"name"` | `"email"` | `"phone"` |
`"username"`>

The shape of a newly received user.

#### Defined in

[types/global.d.ts:232][30]

---

### NextApiState

Ƭ **NextApiState**<`T`>: `Object`

A type combining NextApiRequest and NextApiResponse.

#### Type parameters

| Name | Type      |
| :--- | :-------- |
| `T`  | `unknown` |

#### Type declaration

| Name  | Type                   |
| :---- | :--------------------- |
| `req` | `NextApiRequest`       |
| `res` | `NextApiResponse`<`T`> |

#### Defined in

[types/global.d.ts:18][31]

---

### PatchUser

Ƭ **PatchUser**: `Pick`<[`InternalUser`][14], `"name"` | `"email"` | `"phone"`>

The shape of a received update to an existing user.

#### Defined in

[types/global.d.ts:237][32]

---

### PublicBark

Ƭ **PublicBark**: `Pick`<[`InternalBark`][10], `"content"` | `"createdAt"` |
`"deleted"` | `"private"`> & { `bark_id`: `string` ; `barkbackTo`: `string` |
`null` ; `barkbacks`: [`InternalBark`][10]\[`"totalBarkbacks"`] ; `likes`:
[`InternalBark`][10]\[`"totalLikes"`] ; `owner`: `string` ; `rebarkOf`: `string`
| `null` ; `rebarks`: [`InternalBark`][10]\[`"totalRebarks"`] }

The shape of a publicly available Bark.

#### Defined in

[types/global.d.ts:194][33]

---

### PublicUser

Ƭ **PublicUser**: `Pick`<[`InternalUser`][14], `"name"` | `"email"` | `"phone"`
| `"username"` | `"deleted"`> & { `bookmarked`: `number` ; `following`: `number`
; `liked`: `number` ; `packmates`: `number` ; `user_id`: `string` }

The shape of a publicly available user.

#### Defined in

[types/global.d.ts:210][34]

[1]: ../README.md
[2]: ../interfaces/types_global.barkid.md
[3]: ../interfaces/types_global.followedid.md
[4]: ../interfaces/types_global.packmateid.md
[5]: ../interfaces/types_global.unixepochms.md
[6]: ../interfaces/types_global.userid.md
[7]: types_global.md#corpusdata
[8]: types_global.md#corpusdialogline
[9]: types_global.md#internalapikey
[10]: types_global.md#internalbark
[11]: types_global.md#internalinfo
[12]: types_global.md#internallimitedlogentry
[13]: types_global.md#internalrequestlogentry
[14]: types_global.md#internaluser
[15]: types_global.md#newbark
[16]: types_global.md#newuser
[17]: types_global.md#nextapistate
[18]: types_global.md#patchuser
[19]: types_global.md#publicbark
[20]: types_global.md#publicuser
[21]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L242
[22]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L250
[23]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L258
[24]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L34
[25]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L26
[26]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L278
[27]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L266
[28]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L125
[29]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L224
[30]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L232
[31]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L18
[32]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L237
[33]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L194
[34]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/86fb7f5/types/global.d.ts#L210
