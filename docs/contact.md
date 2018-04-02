# Contact

## Schema

| field            | type    | required | default | validate |
| ---------------- | ------- | -------- | ------- | -------- |
| _id              | String  | true     |         |          |
| address          | String  | true     |         |          |
| port             | Number  | true     |         |          |
| lastSeen         | Date    | true     |         |          |
| reputation       | Number  | false    |         |          |
| lastTimeout      | Date    | false    |         |          |
| timeoutRate      | Number  | false    |         |          |
| responseTime     | Number  | false    |         |          |
| lastContractSent | Number  | false    |         |          |
| spaceAvailable   | Boolean | false    |         |          |
| protocol         | String  | true     |         |          |
| userAgent        | String  | false    |         |          |

Indexes:

* **lastSeen**: 1
* **responseTime**: 1, spaceAvailable: 1, _id: -1
* **reputation**: 1
* **address**: 1
