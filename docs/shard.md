# Shard

## Schema

| field                     | type   | required | default | validate |
| ------------------------- | ------ | -------- | ------- | -------- |
| hash                      | String | true     |         |          |
| [contracts](#contracts)   | list   |          |         |          |
| [trees](#trees)           | list   |          |         |          |
| [challenges](#challenges) | list   |          |         |          |
| [meta](#meta)             | list   |          |         |          |

Indexes:

* **hash**: 1; unique: true
* **contracts.nodeID**: 1
* **contracts.contract.store_end**: 1

## contracts

| field    | type   | required | default | validate |
| -------- | ------ | -------- | ------- | -------- |
| nodeID   | String |          |         |          |
| contract | Object |          |         |          |
| _id      | false  |          |         |          |

## trees

| field  | type   | required | default | validate |
| ------ | ------ | -------- | ------- | -------- |
| nodeID | String |          |         |          |
| tree   | Array  |          |         |          |
| _id    | false  |          |         |          |

## challenges

| field     | type   | required | default | validate |
| --------- | ------ | -------- | ------- | -------- |
| nodeID    | String |          |         |          |
| challenge | Object |          |         |          |
| _id       | false  |          |         |          |

## meta

| field  | type   | required | default | validate |
| ------ | ------ | -------- | ------- | -------- |
| nodeID | String |          |         |          |
| meta   | Object |          |         |          |
| _id    | false  |          |         |          |
