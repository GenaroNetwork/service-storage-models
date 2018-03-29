# PublicKey

## Schema

| field  | type      | required | default | validate     |
| ------ | --------- | -------- | ------- | ------------ |
| _id    | String    | true     |         |              |
| user   | ref: User |          |         | isValidEmail |
| lablel | String    |          |         |              |

Indexes:

* **user**: 1

Fields:

* **_id**: 即key。