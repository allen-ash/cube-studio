import React, { ReactText, useEffect, useState } from 'react';
import { Button, Col, Input, DatePicker, TablePaginationConfig, Row, message, Space, Menu, Dropdown, Modal, Spin, Form, Tag, Popover, Tooltip, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { getTaskManagerList, getTaskDependencyList, actionRecord, actionFreeze, actionUnFreeze, actionMultiTaskDelete, actionChangeDuty } from '../../api/swallowApi';
import { ITaskDependencyItem, ITaskManagerItem } from '../../api/interface/swallowInterface';
import TitleHeader from '../../components/TitleHeader/TitleHeader';
import TableBox from '../../components/TableBox/TableBox';
import moment from "moment";
import { CopyOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getParam, getTableScroll } from '../../util';
import ModalForm from '../../components/ModalForm/ModalForm';
import cookies from 'js-cookie';
import { TTaskCircle, TTaskState, TTaskType } from '../../api/interface/stateInterface';

const { RangePicker } = DatePicker;

export default function TaskListManager() {
    const userName = cookies.get('myapp_username') || ''
    const PAGE_SIZE = 10;
    const navigate = useNavigate();
    const [dataList, setDataList] = useState<ITaskManagerItem[]>([]);
    const [dataListDenpendency, setDataListDenpendency] = useState<ITaskDependencyItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDependency, setLoadingDependency] = useState(false)
    // const [visible, setVisible] = useState(false);
    const [inCharge, setInCharge] = useState<string | undefined>(getParam('inCharge') || userName)
    const [usTaskId, setUsTaskId] = useState<string | undefined>(getParam('taskId'))//20210818172150283
    const [viewId, setViewId] = useState<string | undefined>(getParam('viewId'))
    const [usTaskName, setUsTaskName] = useState<string>('')
    const [isRelVisable, setisRelVisable] = useState(false)
    const [loadingRecord, setLoadingRecord] = useState(false)
    const [visableRecord, setVisableRecord] = useState(false)
    const [visableDuty, setVisableDuty] = useState(false)
    const [loadingDuty, setLoadingDuty] = useState(false)
    const [currentId, setCurrentId] = useState<string>()
    const [currentinChanges, setCurrentinChanges] = useState<string>()
    const [currentRecord, setCurrentRecord] = useState<ITaskManagerItem>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([])
    const [notes, setNotes] = useState<string>()
    const [dateInfo, setDateInfo] = useState<{
        startTime: string,
        endTime: string
    }>({
        startTime: moment().subtract(1, 'd').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().subtract(1, 'd').endOf('day').format('YYYY-MM-DD HH:mm:ss')
    })
    const pageInfoInit: TablePaginationConfig = {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
    };
    const [pageInfo, setPageInfo] = useState<TablePaginationConfig>(pageInfoInit);
    const [scrollY, setScrollY] = useState("")
    useEffect(() => {
        setScrollY(getTableScroll())
    }, [])

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = (pageConf = pageInfoInit) => {
        setLoading(true);
        getTaskManagerList({
            inCharge: inCharge || undefined,
            taskName: usTaskName || undefined,
            taskId: usTaskId || undefined,
            notes: notes || undefined,
            viewId: viewId || undefined,
            pageIndex: pageConf.current || 1,
            pageSize: pageConf.pageSize || 10
        })
            .then((res) => {
                const { list, totalSize } = res.data.data.data
                setDataList(list);
                setPageInfo({ ...pageInfoInit, ...pageConf, total: totalSize });
                setSelectedRowKeys([])
            })
            .finally(() => setLoading(false));
    };

    const fetchDependencyList = (taskId: number | string) => {
        setLoadingDependency(true)
        setDataListDenpendency([])
        getTaskDependencyList({ taskId }).then(res => {
            const { parent, son } = res.data.data
            setDataListDenpendency([...parent, ...son])
        }).finally(() => {
            setLoadingDependency(false)
        })
    }

    const handleMultiRecord = () => {
        if (selectedRowKeys.length) {
            Modal.confirm({
                title: '批量删除',
                icon: <ExclamationCircleOutlined />,
                content: '确定批量删除任务?',
                okText: '确认批量删除',
                cancelText: '取消',
                okButtonProps: { danger: true },
                onOk() {
                    return new Promise((resolve, reject) => {
                        actionMultiTaskDelete({
                            id: selectedRowKeys.join(','),
                        })
                            .then((res) => {
                                resolve('');
                            })
                            .catch((err) => {
                                reject();
                            });
                    })
                        .then((res) => {
                            message.success('批量删除成功');
                            fetchData()
                        })
                        .catch(() => {
                            message.error('批量删除失败');
                        });
                },
                onCancel() { },
            });
        } else {
            message.warn('请先选择')
        }
    }
    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    return (
        <div className="fade-in">
            <ModalForm
                title="修改负责人"
                loading={loadingDuty}
                visible={visableDuty}
                formData={{
                    inCharges: currentinChanges
                }}
                onCancel={() => { setVisableDuty(false) }}
                onCreate={(values) => {
                    setLoadingRecord(true)
                    const { inCharges } = values

                    actionChangeDuty({
                        usTaskId: currentId || '',
                        modifier: cookies.get('myapp_username') || '',
                        inCharges: inCharges
                    })
                        .then((res) => {
                            message.success('修改负责人成功')
                            fetchData()
                        })
                        .catch((err) => {
                            message.error('修改负责人失败，请使用";"号分隔')
                        })
                        .finally(() => { setVisableDuty(false) });
                }}
            >
                <Form.Item
                    label="负责人"
                    name="inCharges"
                    help="请使用';'号分隔"
                    rules={[{ required: true, message: '请选输入负责人' }]}
                >
                    <Input />
                </Form.Item>
            </ModalForm>

            <ModalForm
                title="补录"
                loading={loadingRecord}
                visible={visableRecord}
                onCancel={() => { setVisableRecord(false) }}
                onCreate={(values) => {
                    setLoadingRecord(true)
                    const { fromDate, toDate } = values
                    actionRecord({
                        taskId: currentId || '',
                        fromDate: fromDate.format('YYYY-MM-DD HH:mm:ss'),
                        toDate: toDate.format('YYYY-MM-DD HH:mm:ss'),
                        userName,
                    }).then((res: any) => {
                        if (res.data.success) {
                            message.success('补录成功')
                            fetchData()
                            setVisableRecord(false)
                        } else {
                            message.error(res.data.errorMessage)
                        }
                    }).catch(err => {
                        message.error('补录失败')
                    }).finally(() => {
                        setLoadingRecord(false)
                    })
                }}
            >
                <Form.Item
                    label="开始时间"
                    name="fromDate"
                    rules={[{ required: true, message: '请选择开始时间' }]}
                >
                    <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        disabledTime={() => {
                            let disabledHours
                            if (currentRecord?.cycleUnit === 'D') {
                                disabledHours = () => range(0, 24)
                            }
                            return {
                                disabledHours,
                                disabledMinutes: () => range(0, 60),
                                disabledSeconds: () => range(0, 60),
                            }
                        }}
                        disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="结束时间"
                    name="toDate"
                    rules={[{ required: true, message: '请选择结束时间' }]}
                >
                    <DatePicker showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        disabledTime={() => {
                            let disabledHours
                            if (currentRecord?.cycleUnit === 'D') {
                                disabledHours = () => range(0, 24)
                            }
                            return {
                                disabledHours,
                                disabledMinutes: () => range(0, 60),
                                disabledSeconds: () => range(0, 60),
                            }
                        }}
                        disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                        }}
                    />
                </Form.Item>
            </ModalForm>
            <Modal
                title="父子关联列表"
                visible={isRelVisable}
                footer={null}
                width={1700}
                onCancel={() => { setisRelVisable(false) }}>
                <TableBox
                    titleNode={null}
                    rowKey={(record: ITaskDependencyItem) => {
                        return record.taskId
                    }}
                    columns={[
                        {
                            title: '任务名称',
                            dataIndex: 'taskName',
                            key: 'taskName',
                            width: 400,
                            // fixed: 'left',
                            render: (text: any, record: ITaskDependencyItem) => {
                                return <div>
                                    <div className="pb8 link" onClick={() => {
                                        navigate({
                                            pathname: "/data_model/data_pipeline/instance_manager",
                                            search: `?${createSearchParams({
                                                taskId: record.taskId
                                            })}`
                                        });
                                    }}>{record.taskName}</div>
                                </div>
                            }
                        },
                        {
                            title: '任务名称',
                            dataIndex: 'taskId',
                            key: 'taskId',
                            width: 250,
                            render: (text: any, record: ITaskDependencyItem) => {
                                return <div>
                                    <span className="pr4">{record.taskId}</span>
                                    <CopyToClipboard text={record.taskId} onCopy={() => {
                                        message.success('已成功复制到粘贴板')
                                    }}>
                                        <CopyOutlined />
                                    </CopyToClipboard>
                                </div>
                            }
                        },
                        // {
                        //     title: '数据起始时间',
                        //     dataIndex: 'startDate',
                        //     key: 'startDate',
                        //     width: 250,
                        //     sorter: (a: ITaskDependencyItem, b: ITaskDependencyItem) => new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
                        // },
                        // {
                        //     title: '周期',
                        //     dataIndex: 'cycleNumber',
                        //     key: 'cycleNumber',
                        //     width: 250,
                        //     render: (text: any, record: ITaskDependencyItem) => {
                        //         return <div>
                        //             <div>{record.cycleNumber} {record.cycleUnit}</div>
                        //         </div>
                        //     }
                        // },
                        {
                            title: '任务类型',
                            dataIndex: 'taskType',
                            key: 'taskType',
                            width: 150,
                            render: (text: any, record: ITaskDependencyItem) => {
                                return <Tag color="blue">{TTaskType[record.taskType]}</Tag>
                            }
                        },
                        {
                            title: '负责人',
                            dataIndex: 'inCharge',
                            key: 'inCharge',
                            width: 300
                        },
                        {
                            title: '数据负责人',
                            dataIndex: 'dataCharger',
                            key: 'dataCharger',
                            width: 300
                        },
                        {
                            title: '状态',
                            dataIndex: 'status',
                            key: 'status',
                            width: 150,
                            render: (text: any, record: ITaskDependencyItem) => {
                                return <Tag color='default'>{TTaskState[record.status]}</Tag>
                            }
                        },
                    ]}
                    loading={loadingDependency}
                    // pagination={pageInfo}
                    dataSource={dataListDenpendency}
                    // onChange={(pageInfo: any) => {
                    //     setPageInfo(pageInfo)
                    // }}
                    scroll={{ x: 1200, y: undefined }}
                />
            </Modal>
            <TitleHeader title="任务运行管理" />
            <Content className="appmgmt-content">
                <div className="d-f plr24 fw">
                    {/* <div className="mr16 d-f ac">
                        <span className="s0" style={{ width: 80 }}>任务类型：</span>
                        <Select style={{ width: 256 }} placeholder="任务类型" />
                    </div> */}
                    <div className="mr8 d-f ac pt24">
                        <span className="ta-l s0" style={{ width: 80 }}>业务分组：</span>
                        <Select placeholder="业务分组" style={{ width: 200 }} options={[
                            { label: '全部', value: '' },
                            { label: '全民k歌', value: 'swallow_ch_tag_qmkg' },
                            { label: 'qq音乐', value: 'swallow_ch_tag_qqmusic' },
                            { label: '懒人听书', value: 'swallow_ch_tag_lrts' },
                            { label: '酷狗音乐', value: 'swallow_ch_tag_kugou' },
                        ]} onChange={(value) => setNotes(value)} />
                    </div>
                    <div className="mr8 d-f ac pt24">
                        <span className="ta-r s0" style={{ width: 80 }}>任务名：</span>
                        <Input onPressEnter={() => {
                            if (usTaskId || inCharge || usTaskName) {
                                fetchData()
                            } else {
                                message.warn('任务名/Id或者负责人不能都为空')
                            }
                        }} placeholder="任务名" style={{ width: 200 }} value={usTaskName} onChange={(e) => setUsTaskName(e.target.value)} />
                    </div>
                    <div className="mr8 d-f ac pt24">
                        <span className="ta-r s0" style={{ width: 80 }}>任务ID：</span>
                        <Input onPressEnter={() => {
                            if (usTaskId || inCharge || usTaskName) {
                                fetchData()
                            } else {
                                message.warn('任务名/Id或者负责人不能都为空')
                            }
                        }} placeholder="任务Id" style={{ width: 200 }} value={usTaskId} onChange={(e) => setUsTaskId(e.target.value)} />
                    </div>
                    <div className="mr8 d-f ac pt24">
                        <span className="ta-r s0" style={{ width: 80 }}>视图ID：</span>
                        <Input onPressEnter={() => {
                            if (usTaskId || inCharge || usTaskName) {
                                fetchData()
                            } else {
                                message.warn('任务名/Id或者负责人不能都为空')
                            }
                        }} placeholder="视图ID" style={{ width: 200 }} value={viewId} onChange={(e) => setViewId(e.target.value)} />
                    </div>
                    <div className="mr8 d-f ac pt24">
                        <span className="ta-r s0" style={{ width: 80 }}>负责人：</span>
                        <Input onPressEnter={() => {
                            if (usTaskId || inCharge || usTaskName) {
                                fetchData()
                            } else {
                                message.warn('任务名/Id或者负责人不能都为空')
                            }
                        }} placeholder="负责人/英文名" style={{ width: 200 }} value={inCharge} onChange={(e) => setInCharge(e.target.value)} />
                    </div>


                    <Button className="mt24" type="primary" onClick={() => {
                        if (usTaskId || inCharge || usTaskName) {
                            fetchData()
                        } else {
                            message.warn('任务名/Id或者负责人不能都为空')
                        }
                    }}>搜索</Button>
                </div>
                <div className="p16">
                    <TableBox
                        titleNode={<Col className="tablebox-title">任务列表</Col>}
                        buttonNode={<div><Button type="primary" onClick={handleMultiRecord}>批量删除</Button></div>}
                        rowKey={(record: ITaskManagerItem) => {
                            return record.taskId
                        }}
                        // buttonNode={
                        //     <Button type="primary" onClick={() => setVisible(true)}>
                        //         新建
                        //     </Button>
                        // }
                        columns={[
                            {
                                title: '任务名称',
                                dataIndex: 'taskName',
                                key: 'taskName',
                                width: 400,
                                fixed: 'left',
                                render: (text: any, record: ITaskManagerItem) => {
                                    return <div>
                                        <div className="link" onClick={() => {
                                            navigate({
                                                pathname: "/data_model/data_pipeline/instance_manager",
                                                search: `?${createSearchParams({
                                                    taskId: record.taskId
                                                })}`
                                            });
                                        }}>{record.taskName}</div>
                                    </div>
                                }
                            },
                            {
                                title: '任务Id',
                                dataIndex: 'taskId',
                                key: 'taskId',
                                width: 220,
                                render: (text: any, record: ITaskManagerItem) => {
                                    return <div>
                                        <span className="pr8 link" onClick={() => {
                                            navigate({
                                                pathname: "/data_model/data_pipeline/instance_manager",
                                                search: `?${createSearchParams({
                                                    taskId: record.taskId
                                                })}`
                                            });
                                        }}>{record.taskId}</span>
                                        <CopyToClipboard text={record.taskId} onCopy={() => {
                                            message.success('已成功复制到粘贴板')
                                        }}>
                                            <CopyOutlined />
                                        </CopyToClipboard>
                                    </div>
                                }
                            },
                            {
                                title: '数据起始时间',
                                dataIndex: 'startDate',
                                key: 'startDate',
                                width: 220,
                                sorter: (a: ITaskManagerItem, b: ITaskManagerItem) => new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
                            },
                            {
                                title: '周期',
                                dataIndex: 'cycleNumber',
                                key: 'cycleNumber',
                                width: 100,
                                render: (text: any, record: ITaskManagerItem) => {
                                    return <div className="">
                                        {record.cycleUnit === 'R' ? '' : record.cycleNumber}{TTaskCircle[record.cycleUnit]}
                                    </div>
                                }
                            },
                            {
                                title: '任务类型',
                                dataIndex: 'taskType',
                                key: 'taskType',
                                width: 200,
                                render: (text: any, record: ITaskDependencyItem) => {
                                    return <Tag color="blue">{TTaskType[record.taskType]}</Tag>
                                }
                            },
                            {
                                title: '负责人',
                                dataIndex: 'inCharge',
                                key: 'inCharge',
                                width: 300,
                                render: (text: any, record: ITaskDependencyItem) => {
                                    return <Tooltip title={record.inCharge} placement="topLeft">
                                        <div className="ellip1">
                                            {record.inCharge}
                                        </div>
                                    </Tooltip>
                                }
                            },
                            {
                                title: '数据负责人',
                                dataIndex: 'dataCharger',
                                key: 'dataCharger',
                                width: 150
                            },
                            {
                                title: '状态',
                                dataIndex: 'status',
                                key: 'status',
                                width: 150,
                                render: (text: any, record: ITaskManagerItem) => {
                                    return <Tag color='blue'>{TTaskState[record.status]}</Tag>
                                }
                            },
                            {
                                title: '操作',
                                width: 220,
                                dataIndex: 'handle',
                                key: 'handle',
                                align: 'right',
                                fixed: 'right',
                                render: (text: any, record: ITaskManagerItem) => {
                                    return (
                                        <Space size="middle">
                                            <span className="link" onClick={() => {
                                                navigate({
                                                    pathname: "/data_model/data_pipeline/instance_manager",
                                                    search: `?${createSearchParams({
                                                        taskId: record.taskId
                                                    })}`
                                                });
                                            }}>
                                                实例
                                        </span>
                                            <span className="link" onClick={() => {
                                                setisRelVisable(true)
                                                fetchDependencyList(record.taskId)
                                            }}>
                                                父子关联
                                        </span>
                                            {/* <span className="link" onClick={() => { }}>
                                            视图
                                        </span> */}
                                            <Dropdown overlay={
                                                <Menu>
                                                    {/* <Menu.Item>
                                                <span className="link" onClick={() => { }}>
                                                    终止
                                                </span>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <span className="link" onClick={() => { }}>
                                                    强制成功
                                                </span>
                                            </Menu.Item> */}
                                                    <Menu.Item key={'duty'}
                                                        onClick={() => {
                                                            setCurrentinChanges(record.inCharge)
                                                            setCurrentId(record.taskId)
                                                            setVisableDuty(true)
                                                        }}
                                                    >
                                                        <span className="link">
                                                            修改负责人
                                                        </span>
                                                    </Menu.Item>
                                                    <Menu.Item key={'record'} disabled={(+record.cycleNumber === 1 && record.cycleUnit === 'O') || record.status === 'F'}
                                                        onClick={() => {
                                                            setVisableRecord(true)
                                                            setCurrentId(record.taskId)
                                                            setCurrentRecord(record)
                                                        }}
                                                    >
                                                        <span className={(+record.cycleNumber === 1 && record.cycleUnit === 'O') || record.status === 'F' ? 'link-disable' : 'link'} >
                                                            补录
                                                </span>
                                                    </Menu.Item>
                                                    <Menu.Item key={'freeze'} disabled={record.status === 'F'}
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: '冻结',
                                                                icon: <ExclamationCircleOutlined />,
                                                                content: '确定冻结该任务?',
                                                                okText: '确认冻结',
                                                                cancelText: '取消',
                                                                okButtonProps: { danger: true },
                                                                onOk() {
                                                                    return new Promise((resolve, reject) => {
                                                                        actionFreeze({
                                                                            taskIds: record.taskId,
                                                                            user: cookies.get('myapp_username') || '',
                                                                        })
                                                                            .then((res) => {
                                                                                resolve('');
                                                                            })
                                                                            .catch((err) => {
                                                                                reject();
                                                                            });
                                                                    })
                                                                        .then((res) => {
                                                                            message.success('冻结成功');
                                                                            fetchData()
                                                                        })
                                                                        .catch(() => {
                                                                            message.error('冻结失败');
                                                                        });
                                                                },
                                                                onCancel() { },
                                                            });
                                                        }}
                                                    >
                                                        <span className={record.status === 'F' ? 'link-disable' : 'link'}>
                                                            冻结
                                                </span>
                                                    </Menu.Item>
                                                    <Menu.Item key={'unfreeze'} disabled={record.status !== 'F'}
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: '解除冻结',
                                                                icon: <ExclamationCircleOutlined />,
                                                                content: '确定解除冻结该任务?',
                                                                okText: '确认解除',
                                                                cancelText: '取消',
                                                                okButtonProps: { danger: true },
                                                                onOk() {
                                                                    return new Promise((resolve, reject) => {
                                                                        actionUnFreeze({ taskIds: record.taskId })
                                                                            .then((res) => {
                                                                                resolve('');
                                                                            })
                                                                            .catch((err) => {
                                                                                reject();
                                                                            });
                                                                    })
                                                                        .then((res) => {
                                                                            message.success('解冻成功');
                                                                            fetchData()
                                                                        })
                                                                        .catch(() => {
                                                                            message.error('解冻失败');
                                                                        });
                                                                },
                                                                onCancel() { },
                                                            });
                                                        }}
                                                    >
                                                        <span className={record.status !== 'F' ? 'link-disable' : 'link'}>
                                                            解除冻结
                                                </span>
                                                    </Menu.Item>
                                                    <Menu.Item key="itemDelete"
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: '删除',
                                                                icon: <ExclamationCircleOutlined />,
                                                                content: '确定删除该任务?',
                                                                okText: '确认删除',
                                                                cancelText: '取消',
                                                                okButtonProps: { danger: true },
                                                                onOk() {
                                                                    return new Promise((resolve, reject) => {
                                                                        actionMultiTaskDelete({
                                                                            id: record.taskId,
                                                                        })
                                                                            .then((res) => {
                                                                                resolve('');
                                                                            })
                                                                            .catch((err) => {
                                                                                reject();
                                                                            });
                                                                    })
                                                                        .then((res) => {
                                                                            message.success('删除成功');
                                                                            fetchData()
                                                                        })
                                                                        .catch(() => {
                                                                            message.error('删除失败');
                                                                        });
                                                                },
                                                                onCancel() { },
                                                            });
                                                        }}
                                                    >
                                                        <span className={record.status === 'F' ? 'link-disable' : 'link'}>
                                                            删除
                                                </span>
                                                    </Menu.Item>
                                                </Menu>}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    更多 <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        </Space>
                                    );
                                },
                            },
                        ]}
                        loading={loading}
                        pagination={pageInfo}
                        dataSource={dataList}
                        onChange={(pageInfo: any) => {
                            fetchData(pageInfo)
                        }}
                        rowSelection={{
                            type: 'checkbox',
                            columnWidth: 80,
                            selectedRowKeys,
                            onChange: (selectedRowKeys) => {
                                setSelectedRowKeys(selectedRowKeys)
                            }
                        }}
                        scroll={{ x: 1200, y: scrollY }}
                    />
                </div>
            </Content>
        </div >
    );
}

