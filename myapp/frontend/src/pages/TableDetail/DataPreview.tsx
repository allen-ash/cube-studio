import { TablePaginationConfig } from 'antd'
import React, { useEffect, useState } from 'react'
import { getTableDetailDataPreview } from '../../api/tableDetailApi'
import TableBox from '../../components/TableBox/TableBox'
import { getParam } from '../../util'

export default function DataPreview() {
    const [nodeType, setNodeType] = useState<string>(getParam('nodeType') || '')
    const [nodeId, setNodeId] = useState<string>(getParam('nodeId') || '')
    const [loading, setLoading] = useState(true)
    const [dataList, setDataList] = useState<Record<string, string>[]>([])
    const [columnsConfig, setcolumnsConfig] = useState([])

    const pageInfoInit: TablePaginationConfig = {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
    };
    const [pageInfo, setPageInfo] = useState<TablePaginationConfig>(pageInfoInit);

    useEffect(() => {
        getTableDetailDataPreview({ nodeId, nodeType }).then(res => {
            const data = res.data.data
            let columnsConfig = Object.entries(data[0] || {}).reduce((pre: any, [key, value]) => [...pre, { title: key, dataIndex: key, key }], [])
            setcolumnsConfig(columnsConfig)
            setDataList(data)
        }).catch(err => { }).finally(() => {
            setLoading(false)
        })
    }, [])
    return (
        <div className="p8">
            <TableBox
                loading={loading}
                rowKey={(record: any) => {
                    return JSON.stringify(record)
                }}
                size={'small'}
                cancelExportData={true}
                columns={columnsConfig}
                pagination={pageInfo}
                dataSource={dataList}
                onChange={(pageInfo) => {
                    setPageInfo({
                        ...pageInfo,
                        current: pageInfo.current,
                        pageSize: pageInfo.pageSize
                    })
                }}
                scroll={{ x: 1500 }}
            />
        </div>
    )
}
