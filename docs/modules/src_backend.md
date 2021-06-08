[barker.api.hscc.bdpa.org][1] / src/backend

# Module: src/backend

## Table of contents

### Variables

- [DUMMY_KEY][2]
- [NULL_KEY][3]
- [publicBarkProjection][4]
- [publicUserProjection][5]

### Functions

- [addPackmate][6]
- [addToRequestLog][7]
- [bookmarkBark][8]
- [createBark][9]
- [createUser][10]
- [deleteBarks][11]
- [deleteUser][12]
- [followUser][13]
- [getAllUsers][14]
- [getApiKeys][15]
- [getBarkLikesUserIds][16]
- [getBarks][17]
- [getBookmarkedBarkIds][18]
- [getFollowingUserIds][19]
- [getPackmateUserIds][20]
- [getSystemInfo][21]
- [getUser][22]
- [getUserLikedBarkIds][23]
- [indirectFollowersAggregation][24]
- [isBarkBookmarked][25]
- [isBarkLiked][26]
- [isDueForContrivedError][27]
- [isKeyAuthentic][28]
- [isRateLimited][29]
- [isUserFollowing][30]
- [isUserPackmate][31]
- [likeBark][32]
- [removePackmate][33]
- [searchBarks][34]
- [unbookmarkBark][35]
- [unfollowUser][36]
- [unlikeBark][37]
- [updateUser][38]

## Variables

### DUMMY_KEY

• `Const` **DUMMY_KEY**: `"12349b61-83a7-4036-b060-213784b491"`

This key is only valid when running in a Jest test environment.

#### Defined in

[src/backend/index.ts:62][39]

---

### NULL_KEY

• `Const` **NULL_KEY**: `"00000000-0000-0000-0000-000000000000"`

This key is guaranteed never to appear in the system and can be checked against.

#### Defined in

[src/backend/index.ts:57][40]

---

### publicBarkProjection

• `Const` **publicBarkProjection**: `Object`

#### Type declaration

| Name                | Type      |
| :------------------ | :-------- |
| `_id`               | `boolean` |
| `bark_id`           | `Object`  |
| `bark_id.$toString` | `string`  |
| `barkbackTo`        | `boolean` |
| `barkbacks`         | `string`  |
| `content`           | `boolean` |
| `createdAt`         | `boolean` |
| `deleted`           | `boolean` |
| `likes`             | `string`  |
| `owner`             | `boolean` |
| `private`           | `boolean` |
| `rebarkOf`          | `boolean` |
| `rebarks`           | `string`  |

#### Defined in

[src/backend/index.ts:85][41]

---

### publicUserProjection

• `Const` **publicUserProjection**: `Object`

#### Type declaration

| Name                | Type      |
| :------------------ | :-------- |
| `_id`               | `boolean` |
| `bookmarked`        | `Object`  |
| `bookmarked.$size`  | `string`  |
| `deleted`           | `boolean` |
| `email`             | `boolean` |
| `following`         | `Object`  |
| `following.$size`   | `string`  |
| `liked`             | `Object`  |
| `liked.$size`       | `string`  |
| `name`              | `boolean` |
| `packmates`         | `Object`  |
| `packmates.$size`   | `string`  |
| `phone`             | `boolean` |
| `user_id`           | `Object`  |
| `user_id.$toString` | `string`  |
| `username`          | `boolean` |

#### Defined in

[src/backend/index.ts:100][42]

## Functions

### addPackmate

▸ **addPackmate**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name                  | Type       |
| :-------------------- | :--------- |
| `(destructured)`      | `Object`   |
| ▶ `({ packmate_id })` | `ObjectId` |
| ▶ `({ user_id })`     | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:744][43]

---

### addToRequestLog

▸ **addToRequestLog**(`(destructured)`): `Promise`\<void>

Note that this async function does not have to be awaited. It's fire and forget!

#### Parameters

| Name             | Type               |
| :--------------- | :----------------- |
| `(destructured)` | [NextApiState][44] |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:1190][45]

---

### bookmarkBark

▸ **bookmarkBark**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ bark_id })` | `ObjectId` |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:864][46]

---

### createBark

▸ **createBark**(`(destructured)`): `Promise`<[PublicBark][47]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| ▶ `({ data })`   | `Partial`<[NewBark][48]> |
| ▶ `({ key })`    | `string`                 |

#### Returns

`Promise`<[PublicBark][47]>

#### Defined in

[src/backend/index.ts:413][49]

---

### createUser

▸ **createUser**(`(destructured)`): `Promise`<[PublicUser][50]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| ▶ `({ data })`   | `Partial`<[NewUser][51]> |
| ▶ `({ key })`    | `string`                 |

#### Returns

`Promise`<[PublicUser][50]>

#### Defined in

[src/backend/index.ts:913][52]

---

### deleteBarks

▸ **deleteBarks**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name               | Type         |
| :----------------- | :----------- |
| `(destructured)`   | `Object`     |
| ▶ `({ bark_ids })` | `ObjectId`[] |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:217][53]

---

### deleteUser

▸ **deleteUser**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:535][54]

---

### followUser

▸ **followUser**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name                  | Type       |
| :-------------------- | :--------- |
| `(destructured)`      | `Object`   |
| ▶ `({ followed_id })` | `ObjectId` |
| ▶ `({ user_id })`     | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:626][55]

---

### getAllUsers

▸ **getAllUsers**(`(destructured)`): `Promise`<[PublicUser][50]\[]>

#### Parameters

| Name             | Type                 |
| :--------------- | :------------------- |
| `(destructured)` | `Object`             |
| ▶ `({ after })`  | `ObjectId` \| `null` |

#### Returns

`Promise`<[PublicUser][50]\[]>

#### Defined in

[src/backend/index.ts:495][56]

---

### getApiKeys

▸ **getApiKeys**(): `Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Returns

`Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Defined in

[src/backend/index.ts:1238][57]

---

### getBarkLikesUserIds

▸ **getBarkLikesUserIds**(`(destructured)`): `Promise`\<string\[]>

#### Parameters

| Name              | Type                 |
| :---------------- | :------------------- |
| `(destructured)`  | `Object`             |
| ▶ `({ after })`   | `ObjectId` \| `null` |
| ▶ `({ bark_id })` | `ObjectId`           |

#### Returns

`Promise`\<string\[]>

#### Defined in

[src/backend/index.ts:241][58]

---

### getBarks

▸ **getBarks**(`(destructured)`): `Promise`<[PublicBark][47]\[]>

#### Parameters

| Name               | Type         |
| :----------------- | :----------- |
| `(destructured)`   | `Object`     |
| ▶ `({ bark_ids })` | `ObjectId`[] |

#### Returns

`Promise`<[PublicBark][47]\[]>

#### Defined in

[src/backend/index.ts:187][59]

---

### getBookmarkedBarkIds

▸ **getBookmarkedBarkIds**(`(destructured)`): `Promise`\<string\[]>

#### Parameters

| Name              | Type                 |
| :---------------- | :------------------- |
| `(destructured)`  | `Object`             |
| ▶ `({ after })`   | `ObjectId` \| `null` |
| ▶ `({ user_id })` | `ObjectId`           |

#### Returns

`Promise`\<string\[]>

#### Defined in

[src/backend/index.ts:793][60]

---

### getFollowingUserIds

▸ **getFollowingUserIds**(`(destructured)`): `Promise`\<string\[]>

#### Parameters

| Name                      | Type                 |
| :------------------------ | :------------------- |
| `(destructured)`          | `Object`             |
| ▶ `({ after })`           | `ObjectId` \| `null` |
| ▶ `({ includeIndirect })` | `boolean`            |
| ▶ `({ user_id })`         | `ObjectId`           |

#### Returns

`Promise`\<string\[]>

#### Defined in

[src/backend/index.ts:548][61]

---

### getPackmateUserIds

▸ **getPackmateUserIds**(`(destructured)`): `Promise`\<string\[]>

#### Parameters

| Name              | Type                 |
| :---------------- | :------------------- |
| `(destructured)`  | `Object`             |
| ▶ `({ after })`   | `ObjectId` \| `null` |
| ▶ `({ user_id })` | `ObjectId`           |

#### Returns

`Promise`\<string\[]>

#### Defined in

[src/backend/index.ts:675][62]

---

### getSystemInfo

▸ **getSystemInfo**(): `Promise`<[InternalInfo][63]>

#### Returns

`Promise`<[InternalInfo][63]>

#### Defined in

[src/backend/index.ts:177][64]

---

### getUser

▸ **getUser**(`(destructured)`): `Promise`<[PublicUser][50]>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`<[PublicUser][50]>

#### Defined in

[src/backend/index.ts:519][65]

---

### getUserLikedBarkIds

▸ **getUserLikedBarkIds**(`(destructured)`): `Promise`\<string\[]>

#### Parameters

| Name              | Type                 |
| :---------------- | :------------------- |
| `(destructured)`  | `Object`             |
| ▶ `({ after })`   | `ObjectId` \| `null` |
| ▶ `({ user_id })` | `ObjectId`           |

#### Returns

`Promise`\<string\[]>

#### Defined in

[src/backend/index.ts:281][66]

---

### indirectFollowersAggregation

▸ `Const` **indirectFollowersAggregation**(`user_id`, `after`): ({ `$limit`:
`undefined` ; `$lookup`: `undefined` ; `$match`: { `_id`: [UserId][67] } ;
`$project`: `undefined` ; `$replaceRoot`: `undefined` ; `$sort`: `undefined` ;
`$unwind`: `undefined` } | { `$limit`: `undefined` ; `$lookup`: { `as`: `string`
= 'following_ids'; `foreignField`: `string` = '\_id'; `from`: `string` =
'users'; `localField`: `string` = 'following' } ; `$match`: `undefined` ;
`$project`: `undefined` ; `$replaceRoot`: `undefined` ; `$sort`: `undefined` ;
`$unwind`: `undefined` } | { `$limit`: `undefined` ; `$lookup`: `undefined` ;
`$match`: `undefined` ; `$project`: { `_id`: `undefined` = false; `following`:
`boolean` = true; `following_ids`: { `$reduce`: { `in`: { `$concatArrays`:
`string`\[] } ; `initialValue`: `never`\[] = \[]; `input`: `string` =
'$following_ids.following' } ; `$setUnion`: `undefined` } } ;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: `undefined`  } | { `$limit`: `undefined`;`$lookup`: `undefined` ; `$match`: `undefined`;`$project`: { `_id`: `boolean` = false; `following`: `undefined` = true; `following_ids`: { `$reduce`: `undefined`;`$setUnion`: `string`\[]  }  } ; `$replaceRoot`: `undefined`;`$sort`: `undefined` ; `$unwind`: `undefined` } | {`$limit`: `undefined` ; `$lookup`: `undefined`;`$match`: `undefined` ; `$project`: `undefined`;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: { `path`: `string` = '$following_ids'
} } | { `$limit`: `undefined` ; `$lookup`: `undefined` ; `$match`: `undefined` ;
`$project`: `undefined` ; `$replaceRoot`: { `newRoot`: { `_id`: `string` =
'$following_ids' }  } ; `$sort`: `undefined`;`$unwind`: `undefined`  } | { `$limit`: `undefined`;`$lookup`: `undefined` ; `$match`: { `\_id`: { `$lt`: [UserId][67]  }  } ; `$project`: `undefined`;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: `undefined`  } | { `$limit`: `undefined`;`$lookup`: `undefined` ; `$match`: `undefined`;`$project`: `undefined` ; `$replaceRoot`: `undefined`;`$sort`: { `_id`: `number` = -1 } ; `$unwind`: `undefined` } | {`$limit`: `number` ; `$lookup`: `undefined`;`$match`: `undefined` ; `$project`: `undefined`;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: `undefined`
})\[]

#### Parameters

| Name      | Type                   |
| :-------- | :--------------------- |
| `user_id` | [UserId][67]           |
| `after`   | `null` \| [UserId][67] |

#### Returns

({ `$limit`: `undefined` ; `$lookup`: `undefined` ; `$match`: { `_id`:
[UserId][67] } ; `$project`: `undefined` ; `$replaceRoot`: `undefined` ;
`$sort`: `undefined` ; `$unwind`: `undefined` } | { `$limit`: `undefined` ;
`$lookup`: { `as`: `string` = 'following_ids'; `foreignField`: `string` =
'\_id'; `from`: `string` = 'users'; `localField`: `string` = 'following' } ;
`$match`: `undefined` ; `$project`: `undefined` ; `$replaceRoot`: `undefined` ;
`$sort`: `undefined` ; `$unwind`: `undefined` } | { `$limit`: `undefined` ;
`$lookup`: `undefined` ; `$match`: `undefined` ; `$project`: { `_id`:
`undefined` = false; `following`: `boolean` = true; `following_ids`: {
`$reduce`: { `in`: { `$concatArrays`: `string`\[] } ; `initialValue`: `never`\[]
= \[]; `input`: `string` =
'$following_ids.following' } ; `$setUnion`: `undefined` } } ;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: `undefined`  } | { `$limit`: `undefined`;`$lookup`: `undefined` ; `$match`: `undefined`;`$project`: { `_id`: `boolean` = false; `following`: `undefined` = true; `following_ids`: { `$reduce`: `undefined`;`$setUnion`: `string`\[]  }  } ; `$replaceRoot`: `undefined`;`$sort`: `undefined` ; `$unwind`: `undefined` } | {`$limit`: `undefined` ; `$lookup`: `undefined`;`$match`: `undefined` ; `$project`: `undefined`;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: { `path`: `string` = '$following_ids'
} } | { `$limit`: `undefined` ; `$lookup`: `undefined` ; `$match`: `undefined` ;
`$project`: `undefined` ; `$replaceRoot`: { `newRoot`: { `_id`: `string` =
'$following_ids' }  } ; `$sort`: `undefined`;`$unwind`: `undefined`  } | { `$limit`: `undefined`;`$lookup`: `undefined` ; `$match`: { `\_id`: { `$lt`: [UserId][67]  }  } ; `$project`: `undefined`;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: `undefined`  } | { `$limit`: `undefined`;`$lookup`: `undefined` ; `$match`: `undefined`;`$project`: `undefined` ; `$replaceRoot`: `undefined`;`$sort`: { `_id`: `number` = -1 } ; `$unwind`: `undefined` } | {`$limit`: `number` ; `$lookup`: `undefined`;`$match`: `undefined` ; `$project`: `undefined`;`$replaceRoot`: `undefined` ; `$sort`: `undefined`;`$unwind`: `undefined`
})\[]

#### Defined in

[src/backend/index.ts:114][68]

---

### isBarkBookmarked

▸ **isBarkBookmarked**(`(destructured)`): `Promise`\<boolean>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ bark_id })` | `ObjectId` |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<boolean>

#### Defined in

[src/backend/index.ts:833][69]

---

### isBarkLiked

▸ **isBarkLiked**(`(destructured)`): `Promise`\<boolean>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ bark_id })` | `ObjectId` |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<boolean>

#### Defined in

[src/backend/index.ts:321][70]

---

### isDueForContrivedError

▸ **isDueForContrivedError**(): `boolean`

Note that this is a per-serverless-function request counter and not global
across all Vercel virtual machines.

#### Returns

`boolean`

#### Defined in

[src/backend/index.ts:1227][71]

---

### isKeyAuthentic

▸ **isKeyAuthentic**(`key`): `Promise`\<boolean>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `key` | `string` |

#### Returns

`Promise`\<boolean>

#### Defined in

[src/backend/index.ts:1177][72]

---

### isRateLimited

▸ **isRateLimited**(`req`): `Promise`<`Object`>

#### Parameters

| Name  | Type             |
| :---- | :--------------- |
| `req` | `NextApiRequest` |

#### Returns

`Promise`<`Object`>

#### Defined in

[src/backend/index.ts:1201][73]

---

### isUserFollowing

▸ **isUserFollowing**(`(destructured)`): `Promise`\<boolean>

#### Parameters

| Name                  | Type       |
| :-------------------- | :--------- |
| `(destructured)`      | `Object`   |
| ▶ `({ followed_id })` | `ObjectId` |
| ▶ `({ user_id })`     | `ObjectId` |

#### Returns

`Promise`\<boolean>

#### Defined in

[src/backend/index.ts:596][74]

---

### isUserPackmate

▸ **isUserPackmate**(`(destructured)`): `Promise`\<boolean>

#### Parameters

| Name                  | Type       |
| :-------------------- | :--------- |
| `(destructured)`      | `Object`   |
| ▶ `({ packmate_id })` | `ObjectId` |
| ▶ `({ user_id })`     | `ObjectId` |

#### Returns

`Promise`\<boolean>

#### Defined in

[src/backend/index.ts:714][75]

---

### likeBark

▸ **likeBark**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ bark_id })` | `ObjectId` |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:381][76]

---

### removePackmate

▸ **removePackmate**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name                  | Type       |
| :-------------------- | :--------- |
| `(destructured)`      | `Object`   |
| ▶ `({ packmate_id })` | `ObjectId` |
| ▶ `({ user_id })`     | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:771][77]

---

### searchBarks

▸ **searchBarks**(`(destructured)`): `Promise`<[PublicBark][47]\[]>

#### Parameters

| Name                 | Type                 |
| :------------------- | :------------------- |
| `(destructured)`     | `Object`             |
| ▶ `({ after })`      | `ObjectId` \| `null` |
| ▶ `({ match })`      | `Object`             |
| ▶ `({ regexMatch })` | `Object`             |

#### Returns

`Promise`<[PublicBark][47]\[]>

#### Defined in

[src/backend/index.ts:1033][78]

---

### unbookmarkBark

▸ **unbookmarkBark**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ bark_id })` | `ObjectId` |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:890][79]

---

### unfollowUser

▸ **unfollowUser**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name                  | Type       |
| :-------------------- | :--------- |
| `(destructured)`      | `Object`   |
| ▶ `({ followed_id })` | `ObjectId` |
| ▶ `({ user_id })`     | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:653][80]

---

### unlikeBark

▸ **unlikeBark**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `(destructured)`  | `Object`   |
| ▶ `({ bark_id })` | `ObjectId` |
| ▶ `({ user_id })` | `ObjectId` |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:352][81]

---

### updateUser

▸ **updateUser**(`(destructured)`): `Promise`\<void>

#### Parameters

| Name              | Type                       |
| :---------------- | :------------------------- |
| `(destructured)`  | `Object`                   |
| ▶ `({ data })`    | `Partial`<[PatchUser][82]> |
| ▶ `({ user_id })` | `ObjectId`                 |

#### Returns

`Promise`\<void>

#### Defined in

[src/backend/index.ts:982][83]

[1]: ../README.md
[2]: src_backend.md#dummy_key
[3]: src_backend.md#null_key
[4]: src_backend.md#publicbarkprojection
[5]: src_backend.md#publicuserprojection
[6]: src_backend.md#addpackmate
[7]: src_backend.md#addtorequestlog
[8]: src_backend.md#bookmarkbark
[9]: src_backend.md#createbark
[10]: src_backend.md#createuser
[11]: src_backend.md#deletebarks
[12]: src_backend.md#deleteuser
[13]: src_backend.md#followuser
[14]: src_backend.md#getallusers
[15]: src_backend.md#getapikeys
[16]: src_backend.md#getbarklikesuserids
[17]: src_backend.md#getbarks
[18]: src_backend.md#getbookmarkedbarkids
[19]: src_backend.md#getfollowinguserids
[20]: src_backend.md#getpackmateuserids
[21]: src_backend.md#getsysteminfo
[22]: src_backend.md#getuser
[23]: src_backend.md#getuserlikedbarkids
[24]: src_backend.md#indirectfollowersaggregation
[25]: src_backend.md#isbarkbookmarked
[26]: src_backend.md#isbarkliked
[27]: src_backend.md#isdueforcontrivederror
[28]: src_backend.md#iskeyauthentic
[29]: src_backend.md#isratelimited
[30]: src_backend.md#isuserfollowing
[31]: src_backend.md#isuserpackmate
[32]: src_backend.md#likebark
[33]: src_backend.md#removepackmate
[34]: src_backend.md#searchbarks
[35]: src_backend.md#unbookmarkbark
[36]: src_backend.md#unfollowuser
[37]: src_backend.md#unlikebark
[38]: src_backend.md#updateuser
[39]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L62
[40]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L57
[41]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L85
[42]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L100
[43]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L744
[44]: types_global.md#nextapistate
[45]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L1190
[46]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L864
[47]: types_global.md#publicbark
[48]: types_global.md#newbark
[49]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L413
[50]: types_global.md#publicuser
[51]: types_global.md#newuser
[52]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L913
[53]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L217
[54]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L535
[55]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L626
[56]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L495
[57]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L1238
[58]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L241
[59]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L187
[60]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L793
[61]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L548
[62]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L675
[63]: types_global.md#internalinfo
[64]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L177
[65]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L519
[66]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L281
[67]: ../interfaces/types_global.userid.md
[68]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L114
[69]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L833
[70]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L321
[71]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L1227
[72]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L1177
[73]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L1201
[74]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L596
[75]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L714
[76]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L381
[77]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L771
[78]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L1033
[79]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L890
[80]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L653
[81]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L352
[82]: types_global.md#patchuser
[83]:
  https://github.com/nhscc/barker.api.hscc.bdpa.org/blob/b8087e9/src/backend/index.ts#L982
