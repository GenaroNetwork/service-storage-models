# Bucket

## Schema

| field            | type                           | required | default     | validate |
| ---------------- | ------------------------------ | -------- | ----------- | -------- |
| storage          | Number                         |          | 0           |          |
| transfer         | Number                         |          | 0           |          |
| status           | String(enum: Active, Inactive) |          | 'Active'    |          |
| pubkeys          | list: ref: PublicKey           |          |             |          |
| user             | ref: User                      |          |             |          |
| name             | String                         |          | default: fn |          |
| created          | Date                           |          | Date.now    |          |
| publicPermission | list: String(enum: PUSH, PULL) |          | []          |          |
| encryptionKey    | String                         |          | ''          |          |

Indexes:

* **user**: 1
* **created**: 1
* **user**: 1, **name**: 1; unique: true
