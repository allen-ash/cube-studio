import { RouteObject } from "react-router-dom";
import { TInstanceState } from "./stateInterface";


export interface IRouterConfigPlusItem extends RouteObject {
    title?: string
    appName?: string
    icon?: any
    isMenu?: boolean,
    disable?: boolean,
    children?: IRouterConfigPlusItem[]
}
export interface IInstanceManagerParams {
    usTaskId?: string | number
    inCharge?: string | number
    startTime?: string
    endTime?: string
    stateList?: number | string
}

export interface IInstanceManagerItem {
    desc: IInstanceManagerDescItem[]
    isFirstPage: string
    state: string
}

export interface IInstanceManagerDescItem {
    create_time: string
    cur_run_date: string
    cycle_unit: string
    delay_time: string
    do_flag: string
    ds: null | string
    end_time: string
    error_desc: string
    first_start_time: string
    in_charge: string
    last_log: string
    last_timestamp: string
    last_update: string
    next_run_date: string
    redo_flag: string
    retry_wait: string
    rg_id: string
    rowKey: string
    run_priority: string
    runtime_broker: string
    runtime_id: string
    runtime_port: string
    span: string
    start_time: string
    startup_time: string
    state: string
    tag: string
    task_id: string
    task_name: string
    task_type: string
    tdw_appgroup: string
    tries: string
    try_limit: string
    type_desc: string
}

export interface ITaskManagerParams {
    taskId?: string
    taskName?: string
    inCharge?: string
    notes?: string
    viewId?: string
    pageSize: number
    pageIndex: number
}

export interface ITaskManagerItem {
    cycleNumber: number,
    cycleUnit: string,
    dataCharger: string,
    delayTime: number,
    endDate: string,
    execEngine: string,
    existed: string,
    hasView: string,
    inCharge: string,
    scriptUrl: string,
    startDate: string,
    startupTime: number,
    status: string,
    taskId: string,
    taskName: string,
    taskType: number
}

export interface ITaskDependencyItem {
    dependenceType: number
    inCharge: string
    offsets: number
    status: string
    taskId: string
    taskName: string
    taskType: number
}

export interface IActionRecordParam {
    taskId: number | string
    fromDate: string
    toDate: string
    userName: string
}

export interface IActionRedoParams {
    taskId: number | string
    fromDate: string
    toDate: string
    user: string
    param: string
}

export interface IActionKillParams {
    taskId: number | string
    fromDate: string
    toDate: string
    user: string
}

export interface IInstanceLogParams {
    taskId: string
    curRunDate: string
}

export interface IActionFreezeParams {
    taskIds: string
    user: string
}

export interface IHistoryItem {
    step_action: string
    step_action_name: string
    step_approval_time: string
    step_opinion: string
    step_start_time: string
    step_user: string
    step_user_name: string
    submit_source: string
    target_def_key: string
    task_def_key: string
    task_id: string
    task_name: string
    transfer_user: string
}

export interface IHistoryNode {
    task_name: string,
    approvals: IHistoryItem[]
}

export interface IPendingItem {
    actions: Array<{
        display_name: "同意" | "拒绝" | "转交"
        value: "approval" | "reject" | "transfer"
    }>
    create_time: string
    handler: string
    handler_name: string
    task_def_key: string
    task_id: string
    task_name: string
}

export interface IPendingNode {
    task_name: string,
    handlers: IPendingItem[]
}