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
* PaymentAddr: 1

Fields:

* **payStatus**: 支付状态
  * 0: not paid
  * 1: paid
  * 2: pending
