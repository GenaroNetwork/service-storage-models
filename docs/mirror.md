# Mirror

## Schema

| field         | type         | required | default  | validate | expires |
| ------------- | ------------ | -------- | -------- | -------- | ------- |
| create        | Date         |          | Date.now |          |         |
| shardHash     | String       | true     |          |          |         |
| contact       | ref: Contact | true     |          |          |         |
| contract      | Object       | true     |          |          |         |
| token         | String       | false    |          |          |         |
| isEstablished | Boolean      | false    |          |          |         |

Indexes:

* **shardHash**: 1
* **isEstablished**: -1
