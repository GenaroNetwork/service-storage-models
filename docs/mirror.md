# Mirror

保存可以创建某分片镜像的节点及相关信息。

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

Fields:

* **create**:
* **shardHash**: 分片的哈希值
* **contact**: 节点的相关信息
* **contract**: 存储协议的相关信息
* **token**: （未被使用）
* **isEstablished**:
