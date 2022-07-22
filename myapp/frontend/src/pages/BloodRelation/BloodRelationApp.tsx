import { ApartmentOutlined, RadarChartOutlined, TableOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import React from 'react'
import { IAppMenuItem } from '../../api/interface/kubeflowInterface'
import BloodRelation2 from './bloodRelation2'

export default function BloodRelationApp(props?: IAppMenuItem) {
    return (
        <div className="blood-container fade-in">
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab={<><ApartmentOutlined />血缘可视化</>} key="1">
                    <BloodRelation2 />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<><TableOutlined />表格形式探索</>} disabled key="2"></Tabs.TabPane>
                <Tabs.TabPane tab={<><RadarChartOutlined />全路径探索</>} disabled key="3"></Tabs.TabPane>
            </Tabs>
        </div>
    )
}
