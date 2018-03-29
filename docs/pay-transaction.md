# PayTransaction

## Schema

| field                   | type              | required | default  | validate     |
| ----------------------- | ----------------- | -------- | -------- | ------------ |
| user                    | String(ref: User) | true     |          | isValidEmail |
| totalAmount             | Number            | true     |          |              |
| payMethod               | String: enum      |          | 'none'   |              |
| [payAmount](#payamount) |                   |          |          |              |
| ethTransactionHash      | String            | false    | null     |              |
| state                   | String(enum)      |          | 'init'   |              |
| comment                 | String            | false    | null     |              |
| lastUpdate              | Date              | true     | Date.now |              |
| created                 | Date              | true     | Date.now |              |

Fields:

* **payMethod**: enum
  * freeGNX
  * wallet
  * freeGNXAndWallet
  * none
* **state**: enum
  * init
  * pending
  * success
  * fail

## payamount

从用户免费的GNX和钱包分别扣款数额。

| field         | type   | required | default | validate |
| ------------- | ------ | -------- | ------- | -------- |
| freeGNXAmount | Number | false    |         |          |
| walletAmount  | Number | false    |         |          |
