# PaymentProcess

## Schema

| field   | type         | required | default  | validate |
| ------- | ------------ | -------- | -------- | -------- |
| user    | ref: User    | true     |          |          |
| name    | String: enum | true     |          |          |
| rawData | Mixed        |          |          |          |
| default | Boolean      |          |          |          |
| created | Date         |          | Date.now |          |
