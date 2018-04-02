# Referral

未被使用。

## Schema

| field                   | type         | required | default  | validate |
| ----------------------- | ------------ | -------- | -------- | -------- |
| [sender](#sender)       |              |          |          |          |
| [recipient](#recipient) |              |          |          |          |
| created                 | Date         |          | Date.now |          |
| [converted](#converted) |              |          |          |          |
| type                    | String: enum |          |          |          |
| count                   | Number       |          | 1        |          |

## sender

| field            | type           | required | default            | validate |
| ---------------- | -------------- | -------- | ------------------ | -------- |
| id               | ref: Marketing | true     |                    |          |
| amount_to_credit | Number(min: 0) |          | REFERRAL_RECIPIENT |          |
| credit           | ref: Credit    |          |                    |          |
| referralLink     | String         | true     |                    |          |

Indexes:

* **id**
* **referralLink**

## recipient

| field                 | type           | required | default               | validate |
| --------------------- | -------------- | -------- | --------------------- | -------- |
| email                 | String         | true     |                       |          |
| amount_to_credit      | Number(min: 0) |          | REFERRAL_RECIPIENT    |          |
| credit                | ref: Credit    |          |                       |          |
| min_spent_requirement | Number(min: 0) |          | MIN_SPENT_REQUIREMENT |          |

Indexes:

* **email**
