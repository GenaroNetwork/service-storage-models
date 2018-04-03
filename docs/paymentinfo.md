# PaymentInfo

## Schema

| field       | type   | required | default | validate |
| ----------- | ------ | -------- | ------- | -------- |
| nodeID      | String |          |         |          |
| paymentAddr | String |          |         |          |
| timestamp   | Number |          | 0       |          |
| amount      | Number |          | 0       |          |
| payStatus   | Number |          | 0       |          |
| txHash      | String |          |         |          |

Indexes:

* **nodeID**: 1
* **PaymentAddr**: 1

Fields:

* **nodeID**: 节点的ID
* **paymentAddr**: 节点的钱包地址（目前没有被使用）
* **timestamp**: 存储协议开始的时间
* **amount**: 存储的数据的大小（单位: 字节）
* **payStatus**: 支付状态
  * 0: not paid
  * 1: paid
  * 2: pending
* **txHash**: transaction hash
