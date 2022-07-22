import { Button, Col, message, Row, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { getTableDetailBaseInfo } from '../../api/bloodRelationApi'
import { ITableDeatilBaseInfoItem, ITableDeatilColumnInfoItem, ITableDeatilTaskInfoItem, ITableDeatilTechnicalInfoItem } from '../../api/interface/tableDetail'
import TableBox from '../../components/TableBox/TableBox'
import { getParam } from '../../util'

const CopyToClipboard = require('react-copy-to-clipboard');

export default function BaseInfo() {
    const [nodeType, setNodeType] = useState<string>(getParam('nodeType') || '')
    const [nodeId, setNodeId] = useState<string>(getParam('nodeId') || '')
    const [loading, setLoading] = useState(true)

    const [baseInfo, setbaseInfo] = useState<ITableDeatilBaseInfoItem[]>([])
    const [columnInfo, setColumnInfo] = useState<ITableDeatilColumnInfoItem[]>([])
    const [taskInfo, setTaskInfo] = useState<ITableDeatilTaskInfoItem[]>([])
    const [technicalInfo, setTechnicalInfo] = useState<ITableDeatilTechnicalInfoItem[]>([])
    const [ddl, setDdl] = useState<string>('')

    useEffect(() => {
        getTableDetailBaseInfo({
            nodeId,
            nodeType
        }).then(res => {
            console.log(res.data.data);
            const { col_info, base_info, task_info, technical_info, create_table_ddl } = res.data.data
            setbaseInfo(base_info || [])
            setColumnInfo(col_info || [])
            setTaskInfo(task_info || [])
            setTechnicalInfo(technical_info || [])
            setDdl(create_table_ddl)

        }).catch(() => { }).finally(() => {
            setLoading(false)
        })
    }, [])
    return (
        <div className="d-f h100">
            <div className="flex1 p8">
                <TableBox
                    buttonNode={<CopyToClipboard text={ddl} onCopy={() => message.success('已复制到粘贴板')}>
                        <Button type="primary" >复制DDL语句</Button>
                    </CopyToClipboard>}
                    loading={loading}
                    rowKey={(record: any) => {
                        return JSON.stringify(record)
                    }}
                    size={'small'}
                    cancelExportData={true}
                    columns={[
                        {
                            title: '序号',
                            dataIndex: 'col_index',
                            key: 'col_index',
                            width: 80,
                            render: (text: any, record: any, index: number) => {
                                return index + 1
                            }
                        },
                        {
                            title: '字段名称',
                            dataIndex: 'col_name',
                            key: 'col_name',
                            width: 220,
                        }, {
                            title: '字段安全等级',
                            dataIndex: 'field_security',
                            key: 'field_security',
                            width: 220,
                            render: (text: string) => {
                                return <Tag>{text}</Tag>
                            }
                        }, {
                            title: '描述',
                            dataIndex: 'comment',
                            key: 'comment',
                            width: 220,
                        }, {
                            title: '字段类型',
                            dataIndex: 'data_type',
                            key: 'data_type',
                            width: 220,
                        }, {
                            title: '是否分区字段',
                            dataIndex: 'is_partition_col',
                            key: 'is_partition_col',
                            width: 220,
                            render: (text: boolean) => {
                                return text ? '是' : '否'
                            }
                        }
                    ]}
                    pagination={false}
                    dataSource={columnInfo}
                // scroll={{ x: 1500, y: scrollY }}
                />
            </div>

            <div className="bg-w" style={{ maxWidth: 512 }}>
                {
                    baseInfo.length ? <div className="p24" style={{ borderLeft: '16px solid #f2f3f5', borderBottom: '16px solid #f2f3f5' }}>
                        <div className="mb8"><span className="bor-l b-theme pl4 fs16">基本属性</span></div>
                        {
                            baseInfo.map((item, index) => {
                                return <div className="d-f mb12" key={`baseInfoItem_${index}`}>
                                    <div className="ta-l c-hint-b" style={{ wordBreak: 'keep-all' }}>{item.cn}：</div>
                                    <div><span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{item.value}</span></div>
                                </div>
                            })
                        }
                    </div> : null
                }
                {
                    taskInfo.length ? <div className="pb12 p24" style={{ borderLeft: '16px solid #f2f3f5', borderBottom: '16px solid #f2f3f5' }}>
                        <div className="mb8"><span className="bor-l b-theme pl4 fs16">任务信息</span></div>
                        {
                            taskInfo.map((item, index) => {
                                return <div className="d-f mb12" key={`baseInfoItem_${index}`}>
                                    <div className="ta-l c-hint-b" style={{ wordBreak: 'keep-all' }}>{item.cn}：</div>
                                    <div><span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{item.value}</span></div>
                                </div>
                            })
                        }
                    </div> : null
                }
                {
                    technicalInfo.length ? <div className="p24" style={{ borderLeft: '16px solid #f2f3f5', borderBottom: '16px solid #f2f3f5' }}>
                        <div className="mb8"><span className="bor-l b-theme pl4 fs16">技术信息</span></div>
                        {
                            technicalInfo.map((item, index) => {
                                return <div className="d-f mb12" key={`baseInfoItem_${index}`}>
                                    <div className="ta-l c-hint-b" style={{ wordBreak: 'keep-all' }}>{item.cn}：</div>
                                    <div><span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{item.value}</span></div>
                                </div>
                            })
                        }
                    </div> : null
                }
            </div>
        </div>
    )
}
