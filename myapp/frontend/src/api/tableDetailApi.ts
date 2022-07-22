import { AxiosResponse } from 'axios'
import axios, { AxiosResFormat } from '.'
import { ITableDeatilBaseInfoItem, ITableDeatilColumnInfoItem, ITableDeatilPartitionIitem, ITableDeatilTaskInfoItem, ITableDeatilTechnicalInfoItem } from './interface/tableDetail'

export const getTableDetailBaseInfo = (params: {
    nodeId: string
    nodeType: string
}): AxiosResFormat<{
    col_info: ITableDeatilColumnInfoItem[]
    base_info: ITableDeatilBaseInfoItem[]
    task_info: ITableDeatilTaskInfoItem[]
    technical_info: ITableDeatilTechnicalInfoItem[]
    create_table_ddl: string
}> => {
    return axios.get('/api/dataServices/metadata/getBaseInfo', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}

export const getTableDetailDataPreview = (params: {
    nodeId: string
    nodeType: string
}): AxiosResFormat<Array<Record<string, string>>> => {
    return axios.get('/api/dataServices/metadata/samplingData', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}

export const getTableDetailPartitionDetail = (params: {
    nodeId: string
    nodeType: string
    pageCurrent: number
    pageSize: number
    sortOrder: string
    partition?: string
}): AxiosResFormat<{
    total: number
    page_current: number
    page_size: number
    metadata_partition_infos: ITableDeatilPartitionIitem[]
}> => {
    return axios.get('/api/dataServices/metadata/searchPartitionDetailsPage', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}



