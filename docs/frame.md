# Frame

## Schema

| field       | type         | required | default  | validate     |
| ----------- | ------------ | -------- | -------- | ------------ |
| created     | Date         |          | Date.now |              |
| user        | ref: User    |          |          | isValidEmail |
| locked      | Boolean      |          | false    |              |
| size        | Number       |          | 0        |              |
| storageSize | Number       |          | 0        |              |
| shards      | ref: Pointer |          |          |              |

Indexes:

* **user**: 1
