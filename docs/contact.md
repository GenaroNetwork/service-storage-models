# Contact

节点的相关信息

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
* **responseTime**: 1, **spaceAvailable**: 1, **_id**: -1
* **reputation**: 1
* **address**: 1

Fields:

* **_id**:
* **address**: 节点的IP地址
* **port**: 节点的端口
* **lastSeen**: 最后一次发现联系人的时间
* **reputation**: 节点的信誉值（根据其它属性计算，详见代码）
* **lastTimeout**: 最后一次发生timeout的时间
* **timeoutRate**: timeout发生率（详细计算方式见代码）
* **responseTime**:
* **lastContractSent**:
* **spaceAvailable**: 是否有可用空间
* **protocol**: