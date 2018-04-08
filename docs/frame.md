# Frame

## Schema

| field       | type         | required | default  | validate     |
| ----------- | ------------ | -------- | -------- | ------------ |
| created     | Date         |          | Date.now |              |
| user        | ref: User    |          |          | isValidEmail |
| locked      | Boolean      |          | false    |              |
| size        | Number       |          | 0        |              |
| storageSize | Number       |          | 0        |              |
| shards      | ref: Pointer |          |          |              |

Indexes:

* **user**: 1

Fields:

* **created**: 创建日期
* **user**: 文件上传人
* **locked**: 如果locked则无法通过Frame创建BucketEntry
* **size**: 文件的实际大小
* **storageSize**: 存储在硬盘上的大小（一般比 size 要大，因为包含了 reed-solomon 的校验码）
* **shards**: 分片
