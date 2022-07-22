import { AxiosResponse } from 'axios'
import axios, { AxiosResFormat } from '.'
import mockData from '../pages/BloodRelation/mock'
import { IBloodRelationNode, IBloodRelationNodeDetailItem, IBloodRelationParams, TBloodRelationNodeType } from './interface/bloodRelationInterface'

export const getBloodRelation = (params: IBloodRelationParams): AxiosResFormat<{
    blood: IBloodRelationNode[]
}> => {
    return axios.get('/api/dataServices/metadata/exploreMetadataBlood', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
    return new Promise((resolve) => {
        const data: any = {
            data: {
                data: {
                    blood: [mockData]
                }
            }
        }
        resolve(data)
    })
}

export const getBloodRelationDetail = (params: {
    nodeId: string,
    nodeType: TBloodRelationNodeType
}): AxiosResFormat<{
    tab_meta: {
        details: Array<{
            data: IBloodRelationNodeDetailItem[]
        }>
    }
}> => {
    return axios.get('/api/dataServices/metadata/searchNodeDetails', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}

export const getBloodRelationListData = (params: IBloodRelationParams): AxiosResFormat<IBloodRelationNode[]> => {
    return axios.get('/api/dataServices/metadata/exploreMetadataBloodA2B', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}

export const getBloodRelationCSVData = (params: IBloodRelationParams): AxiosResFormat<IBloodRelationNode[]> => {
    return axios.get('/api/dataServices/metadata/exploreMetadataBloodA2BCsv', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}

export const getTableDetailBaseInfo = (params: {
    nodeId: string
    nodeType: string
}): AxiosResFormat<{
    col_info: []
    base_info: []
    task_info: []
    technical_info: []
    create_table_ddl: string
}> => {
    return axios.get('/api/dataServices/metadata/getBaseInfo', {
        params,
        // baseURL: 'http://9.135.153.92:2345'
    })
}

export const getNodeListByNodeId = (nodeId: string): AxiosResFormat<Record<TBloodRelationNodeType, string[]>> => {
    return axios.get('/api/dataServices/metadata/searchNodes', {
        params: {
            nodeId
        },
        // baseURL: 'http://9.135.153.92:2345'
    })
}

