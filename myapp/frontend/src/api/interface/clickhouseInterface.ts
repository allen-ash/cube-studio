export interface IDatabaseDetailItem {
    databaseName: string,
    size: number | null,
    tables: ITableDetailItem[]
}

export interface ITableDetailItem {
    database: string,
    table: string,
    partitionsNum: number,
    size: number,
    formattedSize: string,
    ttl: number,
    recommendedTtl: number,
    cost: number,
    savedCostWithRecommendedTtl: number,
    swallowTaskId: number,
    owner: string,
    tableSourceType: string
    cycleNumber: number
}

export interface IClickHouseTaskItem {
    date: string
    endTimestamp: string
    referredChartId: string | null
    referredChartName: string | null
    referredDashboardId: string | null
    sql: string
    startTimestamp: string
    taskId: string
    taskStatus: string
    userId: string | null
    userName: string | null
    count: number
    duration: number
}