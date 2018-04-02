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
* **wallet**: 用户默认钱包。
* **activator**: 激活用户账户的token。
* **deactivator**: 注销用户的token。
* **resetter**: 用户重置密码的token。
* **activated**: 用户是否已激活。
* **isFreeTier**: 是否为免费用户，免费用户上传下载受限。
* **referralPartner**: 介绍人(Partner)（目前没什么用）
* **freeGnx**: （未使用）

### preferences

| field | type    | required | default | validate |
| ----- | ------- | -------- | ------- | -------- |
| dnt   | Boolean | true     | false   |          |

Fields:

**dnt**: Do not track，是否跟踪用户行为。

### bytesUploaded

| field            | type   | required | default | validate |
| ---------------- | ------ | -------- | ------- | -------- |
| lastHourStarted  | Date   | false    |         |          |
| lastHourBytes    | Number |          | 0       |          |
| lastDayStarted   | Date   | false    |         |          |
| lastDayBytes     | Number |          | 0       |          |
| lastMonthStarted | Date   | false    |         |          |
| lastMonthBytes   | Number |          | 0       |          |

Fields:

* **lastHourStarted**: 最近一小时的开始时间。
* **lastHourBytes**: 最近一小时内用户上传文件的字节数。
* 其它类似

### bytesDownloaded

| field            | type   | required | default | validate |
| ---------------- | ------ | -------- | ------- | -------- |
| lastHourStarted  | Date   | false    |         |          |
| lastHourBytes    | Number |          | 0       |          |
| lastDayStarted   | Date   | false    |         |          |
| lastDayBytes     | Number |          | 0       |          |
| lastMonthStarted | Date   | false    |         |          |
| lastMonthBytes   | Number |          | 0       |          |

Fields:

* 参考上一节: **bytesUploaded**
