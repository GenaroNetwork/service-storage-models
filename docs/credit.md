# Credit

未被使用。

## Schema

| field             | type           | required | default  | validate |
| ----------------- | -------------- | -------- | -------- | -------- |
| paid_amount       | Number(min: 0) |          |          |          |
| invoiced_amount   | Number(min: 0) |          |          |          |
| user              | ref: User      |          |          |          |
| promo_code        | String(enum)   |          |          |          |
| promo_amount      | Number         |          |          |          |
| promo_expires     | Date           |          |          |          |
| promo_referral_id | ref: Referral  |          |          |          |
| paid              | Boolean        |          | false    |          |
| created           | Date           | true     | Date.now |          |
| payment_processor | String(enum)   |          | DEFAULT  |          |
| type              | String(enum)   | true     |          |          |
| data              | Mixed          |          | null     |          |
