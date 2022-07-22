import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getParam } from '../../util'
import BloodRelation2 from '../BloodRelation/bloodRelation2'
import BaseInfo from './BaseInfo'
import DataPreview from './DataPreview'
import PartitionDetail from './PartitionDetail'

export default function TableDetail() {
    const [nodeType, setNodeType] = useState<string>(getParam('nodeType') || '')
    const [nodeId, setNodeId] = useState<string>(getParam('nodeId') || '')
    const defaultActiveKey = getParam('tabId') || '1'
    const navigate = useNavigate();

    return (
        <div className="bg-title h100 p16 d-f fd-c fade-in">
            <div className="bg-w mb16 p16">
                <div className="pb16"><span className="link cp" onClick={() => {
                    navigate('/data/metadata/metadata_table')
                }}><ArrowLeftOutlined />返回</span></div>
                <div className="pb8"><span>库表类型：</span><strong className="fs16">{nodeType}</strong></div>
                <div><span>库表名：</span><strong className="fs16">{nodeId}</strong></div>
            </div>
            <div className="card-container" style={{ overflowY: 'auto' }}>
                <Tabs type="card" defaultActiveKey={defaultActiveKey}>
                    <Tabs.TabPane tab="基本信息" key="1">
                        <BaseInfo />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="血缘关系" key="2">
                        <BloodRelation2 />
                    </Tabs.TabPane>
                    {
                        nodeType === 'TDW' || nodeType === 'CK' ? <>
                            <Tabs.TabPane tab="数据预览" key="3">
                                <DataPreview />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="分区信息" key="4">
                                <PartitionDetail />
                            </Tabs.TabPane>
                        </> : null
                    }
                </Tabs>
            </div>
        </div>
    )
}
