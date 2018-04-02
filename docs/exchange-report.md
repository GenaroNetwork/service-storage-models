# ExchangeReport

## Schema

| field                 | type   | required | default  | validate |
| --------------------- | ------ | -------- | -------- | -------- |
| created               | Date   | true     | Date.now |          |
| reportId              | String | true     |          |          |
| clientId              | String | false    |          |          |
| farmerId              | String | false    |          |          |
| dataHash              | String | true     |          |          |
| exchangeStart         | Date   | true     |          |          |
| exchangeEnd           | Date   | true     |          |          |
| exchangeResultCode    | Number | true     |          |          |
| exchangeResultMessage | String | true     |          |          |
