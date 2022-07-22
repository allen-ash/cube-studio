import React, { ReactText, useEffect, useRef, useState } from 'react';
import { Button, Col, Input, DatePicker, TablePaginationConfig, Row, message, Space, Menu, Dropdown, Modal, Spin, Form, Tag, Popover, Tooltip, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import TitleHeader from '../../components/TitleHeader/TitleHeader';
import TableBox from '../../components/TableBox/TableBox';
import { CopyOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getTableScroll } from '../../util';
import { actionStopClickhouseTask, getStatusList } from '../../api/clickhouseApi';
import { IClickHouseTaskItem } from '../../api/interface/clickhouseInterface';
import CodeEdit from '../../components/CodeEdit';
import moment from "moment";

export default function TaskStatusList() {
    const [dataList, _setDataList] = useState<IClickHouseTaskItem[]>([]);
    const dataListRef = useRef(dataList);
    const setDataList = (data: IClickHouseTaskItem[]): void => {
        dataListRef.current = data;
        _setDataList(data);
    };
    const [isSqlVisable, setIsSqlVisable] = useState(false)
    const [loading, setLoading] = useState(false);
    const [scrollY, setScrollY] = useState("")
    const [timeCount, _setTimeCount] = useState(0);
    const timeCountRef = useRef(timeCount);
    const setTimeCount = (data: number): void => {
        timeCountRef.current = data;
        _setTimeCount(data);
    };
    const [currentDataItem, setCurrentDataItem] = useState<IClickHouseTaskItem>()
    const [taskStatusKey, _setTaskStatusKey] = useState('task_status')
    const taskStatusKeyRef = useRef(taskStatusKey);
    const setTaskStatusKey = (data: string): void => {
        taskStatusKeyRef.current = data;
        _setTaskStatusKey(data);
    };

    useEffect(() => {
        setScrollY(getTableScroll())
    }, [])

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!loading) {
                setTimeCount(timeCountRef.current + 10)
            }
            if (timeCountRef.current > 100) {
                fetchData()
                setTimeCount(0)
            }
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const fetchData = (key = taskStatusKeyRef.current) => {
        setLoading(true);
        getStatusList(key)
            .then((res) => {
                const { taskInfoList } = res.data
                const itemMap = new Map<string, IClickHouseTaskItem>()
                for (let i = 0; i < taskInfoList.length; i++) {
                    const item = taskInfoList[i];
                    item.count = 1
                    itemMap.set(item.taskId, item)
                }

                for (let i = 0; i < dataListRef.current.length; i++) {
                    const item = dataListRef.current[i];
                    const oldItem = itemMap.get(item.taskId)
                    if (oldItem) {
                        oldItem.count = item.count + 1
                        itemMap.set(oldItem.taskId, oldItem)
                    }
                }

                const tarList = [...(itemMap.values() as any)]
                    .sort((a: IClickHouseTaskItem, b: IClickHouseTaskItem) => b.count - a.count)
                    .map((item: IClickHouseTaskItem) => ({
                        ...item,
                        sql: item.sql.replaceAll('&apos;', "'").replaceAll('&quot;', '"'),
                        duration: new Date().valueOf() - new Date(item.startTimestamp).valueOf()
                    }))


                setDataList(tarList);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="p-r">
            {
                !loading ? <progress max="100" value={timeCountRef.current} className="progress-loading-g" id="progress_loading"></progress> : null
            }
            <Modal
                title={<>
                    <span className="pr16">SQL：{currentDataItem?.userName}</span>
                    <span className="pr16">ChartId：{currentDataItem?.referredChartId}</span>
                    <span className="pr16">DashboardId：{currentDataItem?.referredDashboardId}</span>
                </>}
                destroyOnClose
                visible={isSqlVisable}
                footer={null}
                width={1700}
                onCancel={() => { setIsSqlVisable(false) }}>
                <CodeEdit value={currentDataItem?.sql} readonly />
                <div className="pt16 ta-r">
                    <CopyToClipboard text={currentDataItem?.sql || ''} onCopy={() => {
                        message.success('已成功复制到粘贴板')
                    }}>
                        <Button type="primary">复制</Button>
                    </CopyToClipboard>
                </div>
            </Modal>
            <TitleHeader title="任务状态列表" />
            <Content className="appmgmt-content p16">
                <TableBox
                    titleNode={<Col className="tablebox-title">任务列表</Col>}
                    buttonNode={<div className="d-f ac">
                        <div className="mr32">
                            <span>当前集群：</span>
                            <Select style={{ width: 120 }} value={taskStatusKey} options={[
                                { label: '飞天', value: 'task_status' },
                                { label: '腾飞', value: 'task_status_tengfei' },
                                { label: 'joox', value: 'task_status_joox' }
                            ]} onChange={(value) => {
                                setTaskStatusKey(value)
                                fetchData(value)
                            }} /></div>
                        <div className="mr16">总任务数：<strong>{dataListRef.current.length}</strong></div>
                    </div>}
                    rowKey={(record: IClickHouseTaskItem) => {
                        return record.taskId
                    }}
                    columns={[
                        {
                            title: '持续时间',
                            dataIndex: 'duration',
                            key: 'duration',
                            width: 100,
                            align: 'right',
                            fixed: 'left',
                            sorter: (a: IClickHouseTaskItem, b: IClickHouseTaskItem) => b.duration - a.duration,
                            render: (text: any, record: IClickHouseTaskItem) => {
                                const currentSec = Math.floor(record.duration / 1000)
                                const timeFormat = moment.duration(currentSec, 's').toJSON().replace('PT', '').replace('H', '<span style="font-size:12px;">小时</span>').replace('M', '<span style="font-size:12px;">分钟</span>').replace('S', '<span style="font-size:12px;">秒</span>')
                                if (currentSec >= 60 && currentSec <= 120) {
                                    return <span><strong className="c-warn fs18" dangerouslySetInnerHTML={{ __html: timeFormat }}></strong></span>
                                } else if (currentSec > 120) {
                                    return <span><strong className="c-fail fs18" dangerouslySetInnerHTML={{ __html: timeFormat }}></strong></span>
                                } else {
                                    return <span><strong className="c-success fs18" dangerouslySetInnerHTML={{ __html: timeFormat }}></strong></span>
                                }
                            }
                        },
                        {
                            title: '用户名',
                            dataIndex: 'userName',
                            key: 'userName',
                            width: 100,
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return <span className="c-theme">{record.userName || '-'}</span>
                            },
                            filters: [
                                {
                                    text: '全部',
                                    value: 'all'
                                },
                                {
                                    text: '非空',
                                    value: 'string',
                                }, {
                                    text: '空',
                                    value: 'object',
                                }
                            ],
                            filterMultiple: false,
                            onFilter: (value: string, record: IClickHouseTaskItem) => value === 'all' ? true : typeof record.userName === value
                        },
                        {
                            title: '任务Id',
                            dataIndex: 'taskId',
                            key: 'taskId',
                            width: 150,
                            align: 'right',
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return <div>
                                    <span className="pr8 c-theme">{record.taskId}</span>
                                    <CopyToClipboard text={record.taskId} onCopy={() => {
                                        message.success('已成功复制到粘贴板')
                                    }}>
                                        <CopyOutlined />
                                    </CopyToClipboard>
                                </div>
                            },
                            sorter: (rowA: IClickHouseTaskItem, rowB: IClickHouseTaskItem) => rowA.taskId.localeCompare(rowB.taskId)
                        },
                        {
                            title: '看板ID',
                            dataIndex: 'referredDashboardId',
                            key: 'referredDashboardId',
                            width: 80,
                            align: 'right',
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return record.referredDashboardId || '-'
                            },
                            filters: [
                                {
                                    text: '全部',
                                    value: 'all'
                                },
                                {
                                    text: '非空',
                                    value: 'string',
                                }, {
                                    text: '空',
                                    value: 'object',
                                }
                            ],
                            filterMultiple: false,
                            onFilter: (value: string, record: IClickHouseTaskItem) => value === 'all' ? true : typeof record.referredDashboardId === value
                        },
                        {
                            title: '图表ID',
                            dataIndex: 'referredChartId',
                            key: 'referredChartId',
                            width: 80,
                            align: 'right',
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return record.referredChartId || '-'
                            },
                            filters: [
                                {
                                    text: '全部',
                                    value: 'all'
                                },
                                {
                                    text: '非空',
                                    value: 'string',
                                }, {
                                    text: '空',
                                    value: 'object',
                                }
                            ],
                            filterMultiple: false,
                            onFilter: (value: string, record: IClickHouseTaskItem) => value === 'all' ? true : typeof record.referredChartId === value
                        },
                        {
                            title: '图表名称',
                            dataIndex: 'referredChartName',
                            key: 'referredChartName',
                            width: 80,
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return record.referredChartName || '-'
                            },
                            sorter: (rowA: IClickHouseTaskItem, rowB: IClickHouseTaskItem) => {
                                if (rowA.referredChartName && rowB.referredChartName) {
                                    if (rowA.referredChartName === '-') return 1 //将为'-'的放在最后
                                    return rowA.referredChartName.localeCompare(rowB.referredChartName)
                                }
                            }
                        },
                        {
                            title: '任务时间',
                            dataIndex: 'startTimestamp',
                            key: 'startTimestamp',
                            width: 150,
                            sorter: (a: IClickHouseTaskItem, b: IClickHouseTaskItem) => new Date(a.startTimestamp).valueOf() - new Date(b.startTimestamp).valueOf(),
                        },
                        {
                            title: 'SQL',
                            dataIndex: 'sql',
                            key: 'sql',
                            width: 200,
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return <div className="ellip1 link" onClick={() => {
                                    setCurrentDataItem(record)
                                    setIsSqlVisable(true)
                                }}>{record.sql}</div>
                                // return <div className="taskstatus-edit-container" onClick={() => {
                                //     setCurrentDataItem(record)
                                //     setIsSqlVisable(true)
                                // }}><CodeEdit value={record.sql} readonly /></div>
                            },
                            sorter: (rowA: IClickHouseTaskItem, rowB: IClickHouseTaskItem) => {
                                if (rowA.sql && rowB.sql) {
                                    return rowA.sql.localeCompare(rowB.sql)
                                }
                            }
                        },
                        {
                            title: '状态',
                            dataIndex: 'taskStatus',
                            key: 'taskStatus',
                            width: 100,
                            // fixed: 'right',
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return <Tag color='blue'>{record.taskStatus}</Tag>
                            },
                            filters: [
                                {
                                    text: 'executing',
                                    value: 'executing',
                                }, {
                                    text: 'succeed',
                                    value: 'succeed',
                                }, {
                                    text: 'failed',
                                    value: 'failed',
                                }, {
                                    text: 'pending',
                                    value: 'pending',
                                },

                            ],
                            onFilter: (value: string, record: IClickHouseTaskItem) => record.taskStatus.includes(value)
                        },
                        {
                            title: '操作',
                            width: 50,
                            dataIndex: 'handle',
                            key: 'handle',
                            align: 'right',
                            fixed: 'right',
                            render: (text: any, record: IClickHouseTaskItem) => {
                                return <span className="link" onClick={() => {

                                    Modal.confirm({
                                        title: '终止',
                                        icon: <ExclamationCircleOutlined />,
                                        content: '确定终止该任务?',
                                        okText: '确认终止',
                                        cancelText: '取消',
                                        okButtonProps: { danger: true },
                                        onOk() {
                                            return new Promise((resolve, reject) => {
                                                actionStopClickhouseTask(record.taskId)
                                                    .then((res) => {
                                                        resolve('');
                                                    })
                                                    .catch((err) => {
                                                        reject();
                                                    });
                                            })
                                                .then((res) => {
                                                    message.success('终止成功');
                                                    fetchData()
                                                })
                                                .catch(() => {
                                                    message.error('终止失败');
                                                });
                                        },
                                        onCancel() { },
                                    });
                                }}>
                                    终止
                                </span>
                            }
                        }
                    ]}
                    loading={loading}
                    pagination={false}
                    dataSource={dataListRef.current}
                    // onChange={(pageInfo: any) => {
                    //     fetchData(pageInfo)
                    // }}
                    // rowSelection={{
                    //     type: 'checkbox',
                    //     onChange: (selectedRowKeys) => {
                    //         setSelectedRowKeys(selectedRowKeys)
                    //     }
                    // }}
                    scroll={{ x: 1500, y: scrollY }}
                />
            </Content>
        </div >
    );
}

