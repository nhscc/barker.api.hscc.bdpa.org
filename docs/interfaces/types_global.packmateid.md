[barker.api.hscc.bdpa.org][1] / [types/global][2] / PackmateId

# Interface: PackmateId

[types/global][2].PackmateId

## Hierarchy

- [_BarkId_][3]

  ↳ **PackmateId**

## Table of contents

### Properties

- [generationTime][4]

### Methods

- [equals][5]
- [getTimestamp][6]
- [toHexString][7]

## Properties

### generationTime

• **generationTime**: _number_

The generation time of this ObjectId instance

Inherited from: [BarkId][3].[generationTime][8]

Defined in: node_modules/@types/bson/index.d.ts:365

## Methods

### equals

▸ **equals**(`otherID`: _string_ | _ObjectId_): _boolean_

Compares the equality of this ObjectId with `otherID`.

#### Parameters

| Name      | Type                   | Description                           |
| :-------- | :--------------------- | :------------------------------------ |
| `otherID` | _string_ \| _ObjectId_ | ObjectId instance to compare against. |

**Returns:** _boolean_

the result of comparing two ObjectId's

Inherited from: [BarkId][3]

Defined in: node_modules/@types/bson/index.d.ts:391

---

### getTimestamp

▸ **getTimestamp**(): Date

Returns the generation date (accurate up to the second) that this ID was
generated.

**Returns:** Date

the generation date

Inherited from: [BarkId][3]

Defined in: node_modules/@types/bson/index.d.ts:402

---

### toHexString

▸ **toHexString**(): _string_

Return the ObjectId id as a 24 byte hex string representation

**Returns:** _string_

return the 24 byte hex string representation.

Inherited from: [BarkId][3]

Defined in: node_modules/@types/bson/index.d.ts:407

[1]: ../README.md
[2]: ../modules/types_global.md
[3]: types_global.barkid.md
[4]: types_global.packmateid.md#generationtime
[5]: types_global.packmateid.md#equals
[6]: types_global.packmateid.md#gettimestamp
[7]: types_global.packmateid.md#tohexstring
[8]: types_global.barkid.md#generationtime
