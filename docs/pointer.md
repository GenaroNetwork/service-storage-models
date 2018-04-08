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
* **parity**: 校验分片，即当前分片可用于校验和错误恢复（详见 reed-solomon 码），在一系列分片的最后（可能有多个，但并不是总是存在）
* **size**: 分片的大小
* **tree**:
* **challenges**:
