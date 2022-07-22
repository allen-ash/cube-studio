import { Button, Col, message, Row } from 'antd'
import React, { useState } from 'react'
import CodeEdit from '../../components/CodeEdit'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import TableBox from '../../components/TableBox/TableBox';

interface IProps {
    data: INodeDetailItem[]
}

export interface INodeDetailItem {
    label: string
    value: string | number
    key: string
    type: ITNodeDetail
}

export type ITNodeDetail = 'common' | 'table' | 'sql'

export default function NodeDetail(props: IProps) {
    const [isSqlVisable, setIsSqlVisable] = useState(false)
    const [currentDataItem, setCurrentDataItem] = useState<INodeDetailItem>()

    const handelNodeDetailTable = (item: INodeDetailItem) => {
        try {
            JSON.parse(`${item.value || []}`)
        } catch (error) {
            console.log(error);
        }
        const dataList = JSON.parse(`${item.value || '[]'}`)
        let columnsConfig = Object.entries(dataList[0] || {}).reduce((pre: any, [key, value]) => [...pre, { title: key, dataIndex: key, key }], [])

        return <Col span={16}>
            <TableBox
                rowKey={(record: any) => {
                    return JSON.stringify(record)
                }}
                size={'small'}
                cancelExportData={true}
                columns={columnsConfig}
                pagination={false}
                dataSource={dataList}
            // scroll={{ x: 1500, y: scrollY }}
            />
        </Col>
    }

    const handleNodeDetail = (item: INodeDetailItem) => {
        switch (item.type) {
            case 'sql':
                return <Col span={16}>
                    <div className="ellip3" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{item.value}</div>
                    <div>
                        <span className="link cp mr16" onClick={() => {
                            setIsSqlVisable(true)
                            setCurrentDataItem(item)
                        }}>详情</span>
                        <CopyToClipboard text={`${item.value || ''}`} onCopy={() => {
                            message.success('已成功复制到粘贴板')
                        }}>
                            <span className="link cp">复制<CopyOutlined /></span>
                        </CopyToClipboard>
                    </div>
                </Col>
            case 'table':
                return handelNodeDetailTable(item)
            default:
                break;
        }

        let tarValue: any = item.value
        if (item.key === 'us_id') {
            tarValue = <span><a target="_blank" href={`https://us.woa.com/#/taskManage/instance/${item.value}?inChargeType=0&search%7Citem.keywords%7CpageIndex%7CpageSize=%5B%7B%22taskId%22%3A%22${item.value}%22%7D%5D%5B1%5D%5B50%5D&searchNext%7CcycleUnit%7CpageIndex=%5BD%5D%5B1%5D&locale=zh_CN`}>{item.value}</a></span>
        }
        if (item.key === 'lifecycle') {
            tarValue = <span>{item.value}<a className="pl8" target="_blank" href="http://tdwhelper.oa.com/storage_stat/storage_path_info.php">修改生命周期</a></span>
        }
        return <Col span={16}><span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{tarValue}</span></Col>
    }

    return (
        <>
            <Modal
                title={"SQL 语句"}
                destroyOnClose
                visible={isSqlVisable}
                footer={null}
                width={1700}
                onCancel={() => { setIsSqlVisable(false) }}>
                <CodeEdit value={`${currentDataItem?.value || ''}`} readonly />
                <div className="pt16 ta-r">
                    <CopyToClipboard text={`${currentDataItem?.value || ''}`} onCopy={() => {
                        message.success('已成功复制到粘贴板')
                    }}>
                        <Button type="primary">复制<CopyOutlined /></Button>
                    </CopyToClipboard>
                </div>
            </Modal>
            {
                props.data.length ? <>
                    {
                        props.data.map((item, index) => {
                            return <Row className="mb16 w100" key={`nodeDetailItem_${index}`}>
                                <Col span={8}><div className="ta-r"><strong>{item.label}：</strong></div></Col>
                                {handleNodeDetail(item)}
                            </Row>
                        })
                    }
                </> : <div className="ta-c">
                        <img className="w256" src={require('../../images/emptyBg.png')} alt="" />
                        <div>暂无数据</div>
                    </div>
            }
        </>
    )
}
