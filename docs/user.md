# User

## Schema

| field                               | type         | required | default   | validate         |
| ----------------------------------- | ------------ | -------- | --------- | ---------------- |
| _id                                 | String       | true     |           | isValidEmail     |
| uuid                                | String       | true     | uuid      | validateUUID     |
| hashpass                            | String       |          |           | null or len = 64 |
| pendingHashPass                     | String       |          | null      |                  |
| wallet                              | String       |          | null      |                  |
| created                             | Date         |          | Date.now  |                  |
| activator                           | Mixed        |          | activator |                  |
| deactivator                         | Mixed        |          | null      |                  |
| resetter                            | Mixed        |          | null      |                  |
| activated                           | Boolean      |          | false     |                  |
| isFreeTier                          | Boolean      |          | false     |                  |
| [preferences](#preferences)         |              |          |           |                  |
| [bytesUploaded](#bytesuploaded)     |              |          |           |                  |
| [bytesDownloaded](#bytesdownloaded) |              |          |           |                  |
| referralPartner                     | ref: Partner |          | null      |                  |
| freeGnx                             | Number       |          | 0         |                  |

Indexes:

* resetter

Fields:

* **uuid**: 用于跟踪用户行为。用户创建时自动生成。
* **hashpass**: sha256加密的用户密码。用户创建时生成。
* **pendingHashPass**: 用于用户申请重置密码时临时保存密码。
* **resetter**: 用户申请重置密码时的token。

## preferences

| field | type    | required | default | validate |
| ----- | ------- | -------- | ------- | -------- |
| dnt   | Boolean | true     | false   |          |

Fields:

**dnt**: Do not track

## bytesUploaded

| field            | type   | required | default | validate |
| ---------------- | ------ | -------- | ------- | -------- |
| lastHourStarted  | Date   | false    |         |          |
| lastHourBytes    | Number |          | 0       |          |
| lastDayStarted   | Date   | false    |         |          |
| lastDayBytes     | Number |          | 0       |          |
| lastMonthStarted | Date   | false    |         |          |
| lastMonthBytes   | Number |          | 0       |          |

## bytesDownloaded

| field            | type   | required | default | validate |
| ---------------- | ------ | -------- | ------- | -------- |
| lastHourStarted  | Date   | false    |         |          |
| lastHourBytes    | Number |          | 0       |          |
| lastDayStarted   | Date   | false    |         |          |
| lastDayBytes     | Number |          | 0       |          |
| lastMonthStarted | Date   | false    |         |          |
| lastMonthBytes   | Number |          | 0       |          |