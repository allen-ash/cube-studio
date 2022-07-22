import { Button, TablePaginationConfig } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { getTableDetailPartitionDetail } from '../../api/tableDetailApi'
import InputSearch from '../../components/InputSearch/InputSearch'
import TableBox from '../../components/TableBox/TableBox'
import { data2Byte, getParam } from '../../util'

export default function PartitionDetail() {
    const [nodeType, setNodeType] = useState<string>(getParam('nodeType') || '')
    const [nodeId, setNodeId] = useState<string>(getParam('nodeId') || '')
    const [loading, setLoading] = useState(true)
    const [dataList, setDataList] = useState<Record<string, any>[]>([])
    const [partition, setPartition] = useState<string>()
    const pageInfoInit: TablePaginationConfig = {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
    };
    // const [pageInfo, setPageInfo] = useState<TablePaginationConfig>(pageInfoInit);

    const [pageInfo, _setPageInfo] = useState<TablePaginationConfig>(pageInfoInit)
    const pageInfoRef = useRef(pageInfo);
    const setPageInfo = (data: any): void => {
        pageInfoRef.current = data;
        _setPageInfo(data);
    };

    const [columnsConfig, setcolumnsConfig] = useState([
        {
            title: '序号',
            dataIndex: 'col_index',
            key: 'col_index',
            width: 80,
            render: (text: any, record: any, index: number) => {
                return ((pageInfo.current || 0) - 1) * (pageInfo.pageSize || 10) + (index + 1)
            }
        },
        {
            title: '库表名称',
            dataIndex: 'node_id',
            key: 'node_id',
            width: 220,
        },
        {
            title: '分区',
            dataIndex: 'partition',
            key: 'partition',
            width: 220,
        }, {
            title: '分区行数',
            dataIndex: 'row_count',
            key: 'row_count',
            width: 220,
        }, {
            title: '分区大小',
            dataIndex: 'row_size',
            key: 'row_size',
            width: 220,
            // align: 'right',
            render: (text: any) => {
                return data2Byte(+text)
            }
        }
    ])



    useEffect(() => {
        if (nodeType === 'CK') {
            setcolumnsConfig([...columnsConfig, {
                title: '集群详情',
                dataIndex: 'clusters',
                key: 'clusters',
                width: 220,
                render: (text: any) => {
                    const res = (text || []).map((item: any) => {
                        return <div>{item}</div>
                    })
                    return res
                }
            }])
        }
        fetchData()
    }, [])

    const fetchData = (pageCurrent = 1, pageSize = 10) => {
        setLoading(true)
        getTableDetailPartitionDetail({
            nodeId,
            nodeType,
            pageCurrent: pageCurrent - 1,
            pageSize,
            sortOrder: 'DESC',
            partition
        }).then(res => {
            const data = res.data.data
            const { metadata_partition_infos, total } = data
            // let columnsConfig = Object.entries(metadata_partition_infos[0] || {}).reduce((pre: any, [key, value]) => [...pre, { title: key, dataIndex: key, key }], [])
            // setcolumnsConfig(columnsConfig)
            setDataList(metadata_partition_infos)

            setPageInfo({
                ...pageInfo,
                current: pageCurrent,
                pageSize,
                total
            })
        }).catch(err => { }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="p8">
            <TableBox
                buttonNode={<InputSearch value={partition} onSearch={() => {
                    fetchData()
                }} onChange={(value) => setPartition(value)} placeholder="输入分区ID搜索" />}
                loading={loading}
                rowKey={(record: any) => {
                    return JSON.stringify(record)
                }}
                size={'small'}
                cancelExportData={true}
                columns={columnsConfig}
                pagination={pageInfo}
                dataSource={dataList}
                onChange={(info) => {
                    fetchData(info.current, info.pageSize)
                }}
            // scroll={{ x: 1500, y: scrollY }}
            />
        </div>
    )
}
