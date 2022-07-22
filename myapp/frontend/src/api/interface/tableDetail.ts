export interface ITableDeatilColumnInfoItem {
    col_name: string
    comment: string
    data_type: string
    field_security: string
    is_partition_col: boolean
}

export interface ITableDeatilBaseInfoItem {
    cn: string
    key: string
    type: string
    value: string
}

export interface ITableDeatilTaskInfoItem extends ITableDeatilBaseInfoItem { }

export interface ITableDeatilTechnicalInfoItem extends ITableDeatilBaseInfoItem { }

export interface ITableDeatilPartitionIitem {
    id: string
    node_id: string
    partition: string
    row_count: string | null
    row_count_long: string | null
    row_size: string
    row_size_long: number
    update_time: string
}
