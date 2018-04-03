# StorageEvent

## Schema

| field             | type             | required | default  | validate     |
| ----------------- | ---------------- | -------- | -------- | ------------ |
| bucket            | ref: Bucket      | true     |          |              |
| bucketEntry       | ref: BucketEntry | true     |          |              |
| user              | ref: User        |          |          | isValidEmail |
| timestamp         | Date             | true     | Date.now |              |
| downloadBandwidth | Number           | false    |          |              |
| storage           | Number           | false    |          |              |

Indexes:

* **bucket**: 1
* **bucketEntry**: 1
* **user**: 1
