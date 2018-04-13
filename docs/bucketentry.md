# BucketEntry

## Schema

| field               | type         | required | default                   | validate     |
| ------------------- | ------------ | -------- | ------------------------- | ------------ |
| index               | String       |          |                           | isValidIndex |
| frame               | ref: Frame   |          |                           |              |
| bucket              | ref: Bucket  |          |                           |              |
| mimetype            | String(enum) | true     | 'application/octet-stream |              |
| name                | String       |          |                           |              |
| renewal             | Date         |          | Date.now + ms('90d')      |              |
| created             | Date         |          | Date.now                  |              |
| [hmac](#hmac)       |              | false    |                           |              |
| [erasure](#erasure) |              | false    |                           |              |

Indexes:

* **bucket**: 1
* **created**: 1
* **index**: 1; unique: true, sparse: true
* **bucket**: 1, **name**: 1; unique: true

Fields:

* **index**:
* **frame**:
* **bucket**: 所属bucket的ID
* **mimetype**: 文件格式
* **name**:
* **renewal**:
* **created**: 创建日期
* **hmac**:
* **erasure**:

## hmac

| field | type   | required | default | validate |
| ----- | ------ | -------- | ------- | -------- |
| value | String |          |         |          |
| type  | String |          |         |          |

## erasure

| field | type   | required | default | validate |
| ----- | ------ | -------- | ------- | -------- |
| type  | String |          |         |          |
