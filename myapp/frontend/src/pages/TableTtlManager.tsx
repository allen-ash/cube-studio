import React, { useEffect, useState } from 'react';
import { Button, Col, Input, TablePaginationConfig, Row, message, Space, Form, Tag, Collapse, Skeleton, InputNumber, Empty } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import TitleHeader from '../components/TitleHeader/TitleHeader';
import TableBox from '../components/TableBox/TableBox';
import { CaretRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import ModalForm from '../components/ModalForm/ModalForm';
import cookies from 'js-cookie';
import { actionUpdateTTL, getDatabaseList } from '../api/clickhouseApi';
import { IDatabaseDetailItem, ITableDetailItem } from '../api/interface/clickhouseInterface';
import { getParam } from '../util';

const adminList = ['shenyuanli', 'zeluswu', 'jiamingmai', 'martinpchen', 'samcchen', 'flytengzeng', 'xuxuqin', 'admin']
const isAdmin = adminList.includes(cookies.get('myapp_username') || '')

export default function TableTtlManager() {
    const PAGE_SIZE = 10;
    const navigate = useNavigate();
    const [dataList, setDataList] = useState<IDatabaseDetailItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingTTL, setLoadingTTL] = useState(false)
    const [visableTTL, setVisableTTL] = useState(false)
    const [database, setDatabase] = useState<string | undefined>(getParam('database'))
    const [table, setTable] = useState<string | undefined>(getParam('table'))
    const [owner, setOwner] = useState<string | undefined>(cookies.get('myapp_username') || undefined)
    const pageInfoInit: TablePaginationConfig = {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
    };
    const [currentRecord, setCurrentRecord] = useState<ITableDetailItem>()

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = (pageConf = pageInfoInit) => {
        setLoading(true);
        getDatabaseList({
            database: database || undefined,
            table: table || undefined,
            owner: owner || undefined
        })
            .then((res) => {
                setDataList(res.data)
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="fade-in">
            <ModalForm
                title="修改TTL"
                loading={loadingTTL}
                visible={visableTTL}
                formData={{
                    lifecycle: currentRecord?.ttl
                }}
                onCancel={() => { setVisableTTL(false) }}
                onCreate={(values) => {
                    setLoadingTTL(true)
                    const { lifecycle } = values
                    if (currentRecord) {
                        actionUpdateTTL({
                            swallowTaskId: currentRecord.swallowTaskId,
                            db: currentRecord.database,
                            tb: currentRecord.table,
                            lifecycle
                        }).then((res: any) => {
                            if (res.data.success) {
                                message.success('修改TTL成功')
                                fetchData()
                                setVisableTTL(false)
                            } else {
                                message.error(res.data.errorMessage)
                            }
                        }).catch(err => {
                            message.error('修改TTL失败')
                        }).finally(() => {
                            setLoadingTTL(false)
                        })
                    }

                }}
            >
                <Form.Item
                    label="表名称"
                >
                    <span>{currentRecord?.table}</span>
                </Form.Item>
                <Form.Item
                    label="推荐TTL"
                >
                    <span>{currentRecord?.recommendedTtl}</span>
                </Form.Item>
                <Form.Item
                    label="TTL"
                    name="lifecycle"
                    rules={[{ required: true, message: '请输入TTL' }]}
                >
                    <InputNumber style={{ width: 300 }} />
                </Form.Item>
            </ModalForm>
            <TitleHeader title="表TTL管理" />
            <div className="d-f pt24 plr24">
                <div className="mr16 d-f ac">
                    <span className="ta-l s0" style={{ width: 120 }}>数据库名称：</span>
                    <Input onPressEnter={() => { fetchData() }} placeholder="数据库名称" style={{ width: 256 }} value={database} onChange={(e) => setDatabase(e.target.value)} />
                </div>
                <div className="mr16 d-f ac">
                    <span className="ta-r s0" style={{ width: 80 }}>表名称：</span>
                    <Input onPressEnter={() => { fetchData() }} placeholder="表名称" style={{ width: 256 }} value={table} onChange={(e) => setTable(e.target.value)} />
                </div>
                {
                    isAdmin ? <div className="mr16 d-f ac">
                        <span className="ta-r s0" style={{ width: 80 }}>负责人：</span>
                        <Input onPressEnter={() => { fetchData() }} placeholder="负责人/英文名" style={{ width: 256 }} value={owner} onChange={(e) => setOwner(e.target.value)} />
                    </div> : null
                }
                <Button type="primary" onClick={() => {
                    fetchData()
                }}>搜索</Button>
            </div>
            <Content className="appmgmt-content">
                <div className="p24">
                    <Skeleton loading={loading} active style={{ minHeight: 500 }}>
                        {
                            dataList.length ? <Collapse
                                bordered={false}
                                defaultActiveKey={['database0']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                className="site-collapse-custom-collapse"
                            >
                                {
                                    dataList.map((item, index) => {
                                        return <Collapse.Panel header={<>
                                            <span className="mr16">数据库名称：<span className='link'>{item.databaseName}</span></span>
                                            {/* <span className="mr16">数据库大小：{item.size}</span> */}
                                            <span className="mr16">表数目：<span>{item.tables.length}</span></span>
                                        </>} key={`database${index}`} className="site-collapse-custom-panel">

                                            <TableBox
                                                titleNode={<Col className="tablebox-title">任务列表</Col>}
                                                // buttonNode={<div><Button type="primary" onClick={handleMultiRecord}>批量补录</Button></div>}
                                                rowKey={(record: ITableDetailItem) => {
                                                    return `${record.table}_${index}`
                                                }}
                                                // buttonNode={
                                                //     <Button type="primary" onClick={() => setVisible(true)}>
                                                //         新建
                                                //     </Button>
                                                // }
                                                columns={[
                                                    {
                                                        title: '表名',
                                                        dataIndex: 'table',
                                                        key: 'table',
                                                        width: 300,
                                                        fixed: 'left',
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            return <div>
                                                                <div className="c-theme">{record.table}</div>
                                                            </div>
                                                        }
                                                    },
                                                    {
                                                        title: 'TTL',
                                                        dataIndex: 'ttl',
                                                        key: 'ttl',
                                                        width: 100,
                                                        align: 'right',
                                                        sorter: (a: ITableDetailItem, b: ITableDetailItem) => a.ttl - b.ttl,
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            if (record.ttl === -999) {
                                                                return '-'
                                                            }
                                                            return <span className={[record.ttl > record.recommendedTtl ? 'c-fail' : 'c-success'].join(' ')}>{record.ttl}</span>
                                                        }
                                                    },
                                                    {
                                                        title: '推荐TTL',
                                                        dataIndex: 'recommendedTtl',
                                                        key: 'recommendedTtl',
                                                        width: 120,
                                                        align: 'right',
                                                        sorter: (a: ITableDetailItem, b: ITableDetailItem) => a.recommendedTtl - b.recommendedTtl,
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            if (record.recommendedTtl === -999) {
                                                                return '-'
                                                            }
                                                            return <span className="c-theme">{record.recommendedTtl}</span>
                                                        }
                                                    },
                                                    {
                                                        title: '成本',
                                                        dataIndex: 'cost',
                                                        key: 'cost',
                                                        width: 150,
                                                        align: 'right',
                                                        sorter: (a: ITableDetailItem, b: ITableDetailItem) => a.cost - b.cost,
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            return <Tag color='warning'>{(+record.cost || 0).toFixed(2)} ¥</Tag>
                                                        }
                                                    },
                                                    {
                                                        title: '按推荐可节省',
                                                        dataIndex: 'savedCostWithRecommendedTtl',
                                                        key: 'savedCostWithRecommendedTtl',
                                                        width: 150,
                                                        align: 'right',
                                                        sorter: (a: ITableDetailItem, b: ITableDetailItem) => a.savedCostWithRecommendedTtl - b.savedCostWithRecommendedTtl,
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            return <Tag color='blue'>{(+record.savedCostWithRecommendedTtl || 0).toFixed(2)} ¥</Tag>
                                                        }
                                                    },
                                                    {
                                                        title: '类型',
                                                        dataIndex: 'tableSourceType',
                                                        key: 'tableSourceType',
                                                        width: 100,
                                                    },
                                                    {
                                                        title: '表大小',
                                                        dataIndex: 'formattedSize',
                                                        key: 'formattedSize',
                                                        width: 150,
                                                        align: 'right',
                                                        sorter: (a: ITableDetailItem, b: ITableDetailItem) => a.size - b.size,
                                                    },
                                                    {
                                                        title: '分区个数',
                                                        dataIndex: 'cycleNumber',
                                                        key: 'cycleNumber',
                                                        width: 120,
                                                        align: 'right',
                                                        sorter: (a: ITableDetailItem, b: ITableDetailItem) => a.cycleNumber - b.cycleNumber,
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            return record.cycleNumber || '-'
                                                        }
                                                    },
                                                    {
                                                        title: '负责人',
                                                        dataIndex: 'owner',
                                                        key: 'owner',
                                                        width: 100,
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            return record.owner || '-'
                                                        }
                                                    },

                                                    {
                                                        title: '操作',
                                                        width: 100,
                                                        dataIndex: 'handle',
                                                        key: 'handle',
                                                        align: 'right',
                                                        fixed: 'right',
                                                        render: (text: any, record: ITableDetailItem) => {
                                                            return (
                                                                <Space size="middle">
                                                                    <span className="link" onClick={() => {
                                                                        setVisableTTL(true)
                                                                        setCurrentRecord(record)
                                                                    }}>
                                                                        修改TTL
                                                                </span>
                                                                </Space>
                                                            );
                                                        },
                                                    },
                                                ]}
                                                loading={loading}
                                                pagination={false}
                                                dataSource={item.tables.sort((a, b) => b.cost - a.cost)}
                                                // onChange={(pageInfo: any) => {
                                                //     fetchData(pageInfo)
                                                // }}
                                                // rowSelection={{
                                                //     type: 'checkbox',
                                                //     onChange: (selectedRowKeys) => {
                                                //         setSelectedRowKeys(selectedRowKeys)
                                                //     }
                                                // }}
                                                scroll={{ x: 1200, y: 400 }}
                                            />
                                        </Collapse.Panel>
                                    })
                                }
                            </Collapse> : <div className="bor b-side"><Empty className="mtb64" /></div>
                        }
                    </Skeleton>
                </div>
            </Content>
        </div >
    );
}

