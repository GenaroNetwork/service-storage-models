# Partner

## Schema

| field                   | type                   | required | default  | validate |
| ----------------------- | ---------------------- | -------- | -------- | -------- |
| name                    | String                 | true     |          |          |
| revShareTotalPercentage | Number(min: 0, max: 0) |          | 0        |          |
| created                 | Date                   |          | Date.now |          |
| modified                | Date                   |          | Date.now |          |

Indexes:

* **name**; unique: true
