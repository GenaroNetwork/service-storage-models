# UserNonce

未被使用。

## Schema

| field     | type      | required | default  | validate     | expires |
| --------- | --------- | -------- | -------- | ------------ | ------- |
| user      | ref: User | true     |          | isValidEmail |         |
| nonce     | String    | true     |          |              |         |
| timestamp | Date      |          | Date.now |              | 5m      |

Indexes:

* **user**: 1, **nonce**: 1; unique: true
