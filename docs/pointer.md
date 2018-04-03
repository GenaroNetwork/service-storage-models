# Pointer

## Schema

| field      | type         | required | default | validate |
| ---------- | ------------ | -------- | ------- | -------- |
| index      | Number       | true     |         |          |
| hash       | Number       | true     |         |          |
| parity     | Boolean      | false    | false   |          |
| size       | Number       | true     |         |          |
| tree       | list: String |          |         |          |
| challenges | list: String |          |         |          |

Indexes:

* **hash**: 1

Fields:

* **index**: 分片的索引
* **hash**:
* **parity**: 校验位，即当前分片可用于校验，为一系列分片的最后一个（并不是总是存在）
* **size**: 分片的大小
* **tree**:
* **challenges**:
