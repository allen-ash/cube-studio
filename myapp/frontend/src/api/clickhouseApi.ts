import { AxiosResponse } from 'axios'
import axios, { AxiosResFormat } from '.'
import { IClickHouseTaskItem, IDatabaseDetailItem } from './interface/clickhouseInterface'
const BASE_URL = 'http://musichouse.data.tme.woa.com'

const FEITIAN_URL = 'http://fetian.gateway.tme.woa.com'

export const getDatabaseList = (params: {
    database?: string
    table?: string
    owner?: string
}): Promise<AxiosResponse<IDatabaseDetailItem[]>> => {
    return axios.get('/api/v1/getDatabasesOverview', { params, baseURL: BASE_URL })
}

export const actionUpdateTTL = (params: {
    swallowTaskId: number
    db: string
    tb: string
    lifecycle: string
}): Promise<AxiosResponse<{}>> => {
    return axios.get('/api/swallow/lifecycle/offline/set', { params })
}

export const getStatusList = (taskStatusKey: string): Promise<AxiosResponse<{ taskInfoList: IClickHouseTaskItem[] }>> => {
    return axios.get('/getExecutingTasks', { params: { taskStatusKey }, baseURL: FEITIAN_URL })
}

export const actionStopClickhouseTask = (task_id: number | string): Promise<AxiosResponse<{}>> => {
    return axios.get('/kill', { params: { task_id }, baseURL: FEITIAN_URL })
}