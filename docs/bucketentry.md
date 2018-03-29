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

## hmac

| field | type   | required | default | validate |
| ----- | ------ | -------- | ------- | -------- |
| value | String |          |         |          |
| type  | String |          |         |          |

## erasure

| field | type   | required | default | validate |
| ----- | ------ | -------- | ------- | -------- |
| type  | String |          |         |          |
