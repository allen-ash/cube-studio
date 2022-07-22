import axios, { AxiosResFormat, ResponseFormat } from '.'
import { IInstanceManagerItem, IInstanceManagerParams, ITaskManagerParams, ITaskManagerItem, ITaskDependencyItem, IActionRecordParam, IActionRedoParams, IActionKillParams, IInstanceLogParams, IActionFreezeParams, IHistoryItem, IPendingItem } from './interface/swallowInterface';
import Axios from 'axios';

const baseURL = 'http://swallow.tmeoa.com'

export const getInstanceManagerList = (params: IInstanceManagerParams): AxiosResFormat<IInstanceManagerItem[]> => {
    return axios.get('/java/api/swallow/task/instances/get', { params, baseURL })
}

export const getTaskManagerList = (params: ITaskManagerParams): AxiosResFormat<{
    data: {
        list: ITaskManagerItem[],
        pageIndex: number,
        pageSize: number,
        sortItem: string,
        sortType: string,
        totalSize: number
    }
}> => {
    return axios.get('/java/api/swallow/task/tasks/get', { params, baseURL })
}
export const getTaskDependencyList = (params: { taskId: string | number }): AxiosResFormat<{
    // list: ITaskDependencyItem[],
    // pageIndex: number,
    // pageSize: number,
    // sortItem: string,
    // sortType: string,
    // totalSize: number
    parent: ITaskDependencyItem[],
    son: ITaskDependencyItem[]
}> => {
    return axios.get('/java/api/swallow/task/us/task/dependency', { params, baseURL })
}

export const actionRecord = (params: IActionRecordParam): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/task/recording', { params, baseURL })
}

export const actionRedo = (params: IActionRedoParams): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/task/redo', { params, baseURL })
}

export const actionMultiRedo = (params: { list: IActionRedoParams[], userName: string }): AxiosResFormat<{}> => {
    return axios.post('/java/api/swallow/task/us/task/redo', params, { baseURL })
}

export const actionKill = (params: IActionKillParams): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/task/kill', { params, baseURL })
}

export const actionFreeze = (params: IActionFreezeParams): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/tasks/freeze', { params, baseURL })
}

export const actionUnFreeze = (params: { taskIds: string }): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/tasks/unfreeze', { params, baseURL })
}

export const actionChangeDuty = (params: { inCharges: string[], modifier: string, usTaskId: string }): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/replace/incharge', { params, baseURL })
}

export const getInstanceLog = (params: IInstanceLogParams): Promise<{ data: string }> => {
    return axios.get('/java/api/swallow/task/us/instance/log', { params, baseURL })
}

export const actionMultiTaskDelete = (params: { id: string }): AxiosResFormat<{}> => {
    return axios.get('/java/api/swallow/task/us/tasks/delete', { params, baseURL })
}

export const showCustomData = (params: { type: string, code: string, args: string }): Promise<{ data: string }> => {
    return axios.get('/java/api/swallow/check/get/info', { params, baseURL })
}

//获取工单状态
export const getOrderStatus = (params: { instanceId: string | undefined }): Promise<{
    data: {
        data: {
            instance_detail: {
                history_data: IHistoryItem[],
                pending_data: IPendingItem[],
                process_key: string
            }
        }
    }
}> => {
    return axios.get('/java/api/privacy/task/detail', { params, baseURL })
}