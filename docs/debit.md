# Debit

## Schema

| field             | type                | required | default  | validate     |
| ----------------- | ------------------- | -------- | -------- | ------------ |
| amount            | Number              | true     |          |              |
| user              | ref: User           | true     |          | isValidEmail |
| created           | Date                |          | Date.now |              |
| type              | String(enum)        | true     |          |              |
| bandWidth         | Number(min: 0)      |          | 0        |              |
| storage           | Number(min: 0)      |          | 0        |              |
| storageDiscounted | Number(min: 0)      |          | 0        |              |
| payed             | Date                | false    |          |              |
| payedBy           | String(enum)        |          | 'none'   |              |
| payStatus         | String(enum)        |          | 'init'   |              |
| payTransaction    | ref: PayTransaction |          |          |              |

Fields:

* **payedBy**: enum
  * freeGNX
  * wallet
  * freeGNXAndWallet
  * none
* **payStatus**: enum
  * success
  * fail
  * init
