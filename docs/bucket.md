# Bucket

保存用户创建的文件夹。

## Schema

| field             | type                           | required | default     | validate |
| ----------------- | ------------------------------ | -------- | ----------- | -------- |
| storage           | Number                         |          | 0           |          |
| transfer          | Number                         |          | 0           |          |
| status            | String(enum: Active, Inactive) |          | 'Active'    |          |
| pubkeys           | list: ref: PublicKey           |          |             |          |
| user              | ref: User                      |          |             |          |
| name              | String                         |          | default: fn |          |
| created           | Date                           |          | Date.now    |          |
| publicPermissions | list: String(enum: PUSH, PULL) |          | []          |          |
| encryptionKey     | String                         |          | ''          |          |

Indexes:

* **user**: 1
* **created**: 1
* **user**: 1, **name**: 1; unique: true

Fields:

* **storage**: （未被使用）
* **transfer**: （未被使用）
* **status**: （未被使用）
* **pubkeys**: (可以通过接口设置，但是目前没有被使用)
* **user**: bucket所属用户
* **name**: 文件夹名称（数据库中加密）
* **created**: 创建日期
* **publicPermissions**: （未被使用）
* **encryptionKey**: （可通过接口设置，暂未被使用）
