# FullAudit

## Schema

| field     | type    | required | default | validate |
| --------- | ------- | -------- | ------- | -------- |
| farmer_id | String  | true     |         |          |
| data_hash | String  | true     |         |          |
| root      | String  | true     |         |          |
| depth     | String  | true     |         |          |
| challenge | String  | true     |         |          |
| ts        | Date    | true     |         |          |
| proessing | Boolean |          |         |          |
| passed    | Boolean |          |         |          |

Indexes:

* **ts**
