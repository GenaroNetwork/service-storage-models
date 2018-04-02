# Marketing

未被使用。

## Schema

| field        | type      | required | default  | validate |
| ------------ | --------- | -------- | -------- | -------- |
| user         | ref: User | true     |          |          |
| created      | Date      |          | Date.now |          |
| referralLink | String    | true     |          |          |

Indexes:

* **user**; unique: true
* **referralLink**; unique: true
