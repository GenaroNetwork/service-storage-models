# Token

## Schema

| field   | type        | required | default  | validate |
| ------- | ----------- | -------- | -------- | -------- |
| _id     | String      | true     |          |          |
| bucket  | ref: Bucket | true     |          |          |
| expires | Date        | true     | Date.now |          |

Fields:

* **_id**: 即token。