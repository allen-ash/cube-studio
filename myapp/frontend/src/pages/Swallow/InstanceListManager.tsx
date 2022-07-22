import React, { ReactText, useEffect, useState } from 'react';
import { Button, Col, Form, FormInstance, Input, DatePicker, TablePaginationConfig, Row, message, Space, Menu, Dropdown, Modal, Radio, Tag, Tooltip, Spin, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { getInstanceManagerList, actionRedo, actionKill, actionMultiRedo, getInstanceLog } from '../../api/swallowApi';
import { IInstanceManagerItem, IInstanceManagerDescItem, IActionRedoParams } from '../../api/interface/swallowInterface';
import TitleHeader from '../../components/TitleHeader/TitleHeader';
import TableBox from '../../components/TableBox/TableBox';
import moment from "moment";
import { CheckCircleOutlined, CloseCircleOutlined, CopyOutlined, DownOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getTableScroll } from '../../util';
import ModalForm from '../../components/ModalForm/ModalForm';
import cookies from 'js-cookie';
import { TInstanceState } from '../../api/interface/stateInterface';

const { RangePicker } = DatePicker;

export default function InstanceListManager() {
    const userName = cookies.get('myapp_username') || ''
    const PAGE_SIZE = 10;
    const [dataList, setDataList] = useState<IInstanceManagerDescItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [inCharge, setInCharge] = useState<string | undefined>(cookies.get('myapp_username') || undefined)
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId')
    const [usTaskId, setUsTaskId] = useState<string | number>(taskId || '')
    const [stateList, setStateList] = useState<number | string>()
    const [isRelVisable, setisRelVisable] = useState(false)
    const [loadingRedo, setLoadingRedo] = useState(false);
    const [visableRedo, setVisableRedo] = useState(false)
    const [isLogVisable, setIsLogVisable] = useState(false)
    const [redoParams, setRedoParams] = useState<IActionRedoParams>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([])
    const [multiParams, setMultiParams] = useState<IInstanceManagerDescItem[]>([])
    const [currentLog, setCurrentLog] = useState<string>('')
    const [loadingLog, setLoadingLog] = useState(false)
    const [dateInfo, setDateInfo] = useState<{
        startTime: string,
        endTime: string
    }>({
        startTime: moment().subtract(7, 'd').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().subtract(0, 'd').endOf('day').format('YYYY-MM-DD HH:mm:ss')
    })
    const pageInfoInit: TablePaginationConfig = {
        current: 1,
        pageSize: PAGE_SIZE,
        // total: 0,
        // showSizeChanger: true,
        // showQuickJumper: true,
        // showTotal: (total) => `共${total}条`,
    };
    const [pageInfo, setPageInfo] = useState<TablePaginationConfig>(pageInfoInit);
    const [scrollY, setScrollY] = useState("")
    useEffect(() => {
        setScrollY(getTableScroll())
    }, [])

    useEffect(() => {
        if (taskId) {
            fetchData();
        }
    }, []);

    const fetchData = (pageConf = pageInfoInit) => {
        setLoading(true);
        getInstanceManagerList({
            usTaskId: usTaskId || undefined,
            inCharge: inCharge || undefined,
            stateList: stateList !== '' ? stateList : undefined,
            startTime: dateInfo.startTime,
            endTime: dateInfo.endTime
        })
            .then((res) => {
                const { data } = res.data;
                setDataList(data[0].desc);
                // setPageInfo({ ...pageConf, total });
            })
            .finally(() => setLoading(false));
    };

    const handleMultiKill = () => {
        if (multiParams.length) {
            setVisableRedo(true)
        } else {
            message.warn('请先选择')
        }
    }

    const handleMultiRedo = () => {
        if (multiParams.length) {
            setVisableRedo(true)
        } else {
            message.warn('请先选择')
        }
    }

    return (
        <div className="fade-in">
            <Modal
                title={'日志'}
                destroyOnClose
                visible={isLogVisable}
                footer={null}
                width={1700}
                onCancel={() => { setIsLogVisable(false) }}>
                <Spin spinning={loadingLog}>
                    <div style={{ minHeight: 300 }} dangerouslySetInnerHTML={{ __html: currentLog.replaceAll('style>', 'style_abandon>') }}></div>
                </Spin>
            </Modal>
            <ModalForm
                title="重跑"
                loading={loadingRedo}
                visible={visableRedo}
                onCancel={() => { setVisableRedo(false) }}
                onCreate={(values) => {
                    setLoadingRedo(true)
                    const { isRedoSubTask, isCheckParentInstance } = values
                    const user = cookies.get('myapp_username') || '';

                    const params = multiParams.map((item) => ({
                        taskId: item.task_id,
                        fromDate: item.cur_run_date,
                        toDate: item.cur_run_date,
                        user,
                        param: `${isRedoSubTask}${isCheckParentInstance}`
                    }))
                    actionMultiRedo({ list: params, userName }).then((res: any) => {
                        if (res.data.state === 'error') {
                            message.error(res.data.desc)
                        } else {
                            message.success('重跑成功')
                            fetchData()
                            setVisableRedo(false)
                        }
                    }).catch(err => {
                        message.error('重跑失败')
                    }).finally(() => {
                        setLoadingRedo(false)
                    })
                }}
            >
                <Form.Item
                    label="是否重跑子任务"
                    name="isRedoSubTask"
                    initialValue={'1'}
                    rules={[{ required: true, message: '请选择' }]}
                >
                    <Radio.Group>
                        <Radio value={'1'}>只重跑所选任务本身</Radio>
                        <Radio value={'2'}>重跑所选任务本身及其所有的递归子任务</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="是否检查父实例"
                    name="isCheckParentInstance"
                    initialValue={'1'}
                    rules={[{ required: true, message: '请选择' }]}
                >
                    <Radio.Group>
                        <Radio value={'1'}>是</Radio>
                        <Radio value={'2'}>否</Radio>
                    </Radio.Group>
                </Form.Item>
            </ModalForm>
            <TitleHeader title="实例运行管理" />
            <Content className="appmgmt-content">
                {/* <div className="d-f pt24 plr24">

                </div> */}
                <div className="d-f plr24 fw">
                    <div className="mr16 mt24 d-f ac">
                        <span className="s0" style={{ width: 80 }}>任务状态：</span>
                        <Select style={{ width: 256 }} options={[
                            { label: '全部', value: '' },
                            { label: '成功', value: 2 },
                            { label: '失败', value: 3 },
                            { label: '终止', value: 8 },
                            { label: '等待父任务', value: 0 },
                            { label: '等待资源', value: 12 },
                            { label: '正在运行', value: 1 },
                        ]} onChange={(value) => {
                            setStateList(value)
                        }} placeholder="任务状态" />
                    </div>
                    <div className="mr16 mt24 d-f ac">
                        <span className="s0" style={{ width: 80 }}>任务名/Id：</span>
                        <Input onPressEnter={() => { fetchData() }} placeholder="任务名/Id" style={{ width: 256 }} value={usTaskId} onChange={(e) => setUsTaskId(e.target.value)} />
                    </div>
                    <div className="mr16 mt24 d-f ac">
                        <span className="ta-r s0" style={{ width: 80 }}>负责人：</span>
                        <Input onPressEnter={() => { fetchData() }} placeholder="负责人/英文名" style={{ width: 256 }} value={inCharge} onChange={(e) => setInCharge(e.target.value)} />
                    </div>
                    <div className="mr16 mt24 d-f ac">
                        <span className="ta-r s0" style={{ width: 80 }}>数据时间：</span>
                        <RangePicker
                            style={{ width: 256 }}
                            value={[moment(dateInfo.startTime), moment(dateInfo.endTime)]}
                            onChange={(value) => {
                                if (value && value.length) {
                                    const [startTime, endTime] = value
                                    if (startTime && endTime) {
                                        setDateInfo({
                                            startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
                                            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
                                        })
                                    }
                                }
                            }}
                            disabledDate={(current) => {
                                return current && current > moment().endOf('day');
                            }}
                        />
                        <Button className="ml16" type="primary" onClick={() => {
                            if (usTaskId || inCharge) {
                                fetchData()
                            } else {
                                message.warn('任务名/Id或者负责人不能都为空')
                            }
                        }}>搜索</Button>
                    </div>


                </div>
                <div className="p16">
                    <TableBox
                        titleNode={<Col className="tablebox-title">实例列表</Col>}
                        buttonNode={<div>
                            <Dropdown overlay={<Menu>
                                <Menu.Item>
                                    <span className="link" onClick={handleMultiRedo}>
                                        批量重跑
                                </span>
                                </Menu.Item>
                                <Menu.Item>
                                    <span className="link" onClick={handleMultiKill}>
                                        批量终止
                            </span>
                                </Menu.Item>
                            </Menu>}>
                                <Button type='primary'>批量操作 <DownOutlined /></Button>
                            </Dropdown>
                        </div>}
                        rowKey={(record: IInstanceManagerDescItem) => {
                            return record.rowKey
                        }}
                        // buttonNode={
                        //     <Button type="primary" onClick={() => setVisible(true)}>
                        //         新建
                        //     </Button>
                        // }
                        columns={[
                            {
                                title: '任务',
                                dataIndex: 'task_name',
                                key: 'task_name',
                                width: 400,
                                fixed: 'left',
                                render: (text: any, record: IInstanceManagerDescItem) => {
                                    return <div>
                                        <div className="pb4 link">{record.task_name}</div>
                                        <div>
                                            <span className="pr4">{record.task_id}</span>
                                            <CopyToClipboard text={record.task_id} onCopy={() => {
                                                message.success('已成功复制到粘贴板')
                                            }}>
                                                <CopyOutlined />
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                }
                            },
                            {
                                title: '数据启始时间',
                                dataIndex: 'cur_run_date',
                                key: 'cur_run_date',
                                width: 220,
                                sorter: (a: IInstanceManagerDescItem, b: IInstanceManagerDescItem) => new Date(a.cur_run_date).valueOf() - new Date(b.cur_run_date).valueOf(),
                            },
                            {
                                title: '实例执行时间',
                                dataIndex: 'start_time',
                                key: 'start_time',
                                width: 220,
                                render: (text: any, record: IInstanceManagerDescItem) => {
                                    return <div>
                                        <div>{record.start_time}</div>
                                        <div>{record.end_time}</div>
                                    </div>
                                }
                            },
                            {
                                title: '执行时长',
                                dataIndex: 'span',
                                key: 'span',
                                width: 150
                            },
                            {
                                title: '状态',
                                dataIndex: 'state',
                                key: 'state',
                                width: 150,
                                render: (text: any, record: IInstanceManagerDescItem) => {
                                    switch (record.state) {
                                        case '0':
                                        case '1':
                                        case '12':
                                            return <Tag icon={<SyncOutlined spin />} color="processing">
                                                {TInstanceState[record.state]}
                                            </Tag>
                                        case '2':
                                            return <Tag icon={<CheckCircleOutlined />} color="success">
                                                {TInstanceState[record.state]}
                                            </Tag>
                                        case '3':
                                            return <Tag icon={<CloseCircleOutlined />} color="error">
                                                {TInstanceState[record.state]}
                                            </Tag>
                                        case '5':
                                        case '11':
                                            return <Tag icon={<ExclamationCircleOutlined />} color="warning">
                                                {TInstanceState[record.state]}
                                            </Tag>
                                        default:
                                            return <Tag color="default">{TInstanceState[record.state]}</Tag>
                                    }
                                }
                            },
                            {
                                title: '负责人',
                                dataIndex: 'in_charge',
                                key: 'in_charge',
                                width: 300,
                                render: (text: any, record: IInstanceManagerDescItem) => {
                                    return <Tooltip title={record.in_charge} placement="topLeft">
                                        <div className="ellip1">
                                            {record.in_charge}
                                        </div>
                                    </Tooltip>
                                }
                            },
                            {
                                title: '尝试次数',
                                dataIndex: 'try_limit',
                                key: 'try_limit',
                                width: 150,
                                render: (text: any, record: IInstanceManagerDescItem) => {
                                    return <span>{record.tries} / {record.try_limit}</span>
                                }
                            },
                            {
                                title: '操作',
                                width: 150,
                                dataIndex: 'handle',
                                key: 'handle',
                                align: 'right',
                                fixed: 'right',
                                render: (text: any, record: IInstanceManagerDescItem) => {
                                    return (
                                        <Space size="middle">
                                            <span className="link" onClick={() => {
                                                setCurrentLog('')
                                                setIsLogVisable(true)
                                                setLoadingLog(true)
                                                getInstanceLog({
                                                    taskId: record.task_id,
                                                    curRunDate: (record.cur_run_date || "").replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '')
                                                }).then(res => {
                                                    console.log(res.data)
                                                    if (res.data) {
                                                        setCurrentLog(res.data)
                                                    }
                                                }).finally(() => {
                                                    setLoadingLog(false)
                                                })
                                                // window.open(`https://us.oa.com/#/instance/log?taskId=${record.task_id}&curRunDate=${record.cur_run_date}&lastUpdate=${record.last_update}&state=${record.state}`)
                                            }}>
                                                日志
                                        </span>
                                            {/* <span className="link" onClick={() => {

                                        }}>
                                            父实例
                                        </span>
                                        <span className="link" onClick={() => { }}>
                                            强制下发
                                        </span> */}
                                            <span className="link" onClick={() => {
                                                setMultiParams([record])
                                                setSelectedRowKeys([record.rowKey])
                                                setVisableRedo(true)
                                            }}>
                                                重跑
                                        </span>
                                            <span className="link" onClick={() => {
                                                const user = cookies.get('myapp_username') || '';

                                                Modal.confirm({
                                                    title: '终止',
                                                    icon: <ExclamationCircleOutlined />,
                                                    content: '确定终止改标签?',
                                                    okText: '确认终止',
                                                    cancelText: '取消',
                                                    okButtonProps: { danger: true },
                                                    onOk() {
                                                        return new Promise((resolve, reject) => {
                                                            actionKill({
                                                                taskId: record.task_id,
                                                                fromDate: record.cur_run_date,
                                                                toDate: record.cur_run_date,
                                                                user,
                                                            })
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
                                            {/* <Dropdown overlay={<Menu>
                                            <Menu.Item>
                                                <span className="link" onClick={() => { }}>
                                                    终止
                                                </span>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <span className="link" onClick={() => { }}>
                                                    强制成功
                                                </span>
                                            </Menu.Item>
                                        </Menu>}>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                更多 <DownOutlined />
                                            </a>
                                        </Dropdown> */}
                                        </Space>
                                    );
                                },
                            },
                        ]}
                        loading={loading}
                        pagination={pageInfo}
                        dataSource={dataList}
                        onChange={(pageInfo: any) => {
                            setPageInfo(pageInfo)
                        }}
                        rowSelection={{
                            type: 'checkbox',
                            selectedRowKeys,
                            // getCheckboxProps: (record: IInstanceManagerDescItem) => { return record.task_id },
                            onChange: (selectedRowKeys, selectedRows: IInstanceManagerDescItem[]) => {
                                setSelectedRowKeys(selectedRowKeys)
                                setMultiParams(selectedRows)
                            }
                        }}
                        scroll={{ x: 1200, y: scrollY }}
                    />
                </div>
            </Content>
        </div>
    );
}

