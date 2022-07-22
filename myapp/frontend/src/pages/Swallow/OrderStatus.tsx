import React, { useState } from 'react'
import TitleHeader from '../../components/TitleHeader/TitleHeader'
import { Input, Button, Spin, Steps, Empty } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getOrderStatus } from '../../api/swallowApi'
import { IHistoryItem, IHistoryNode, IPendingItem, IPendingNode } from '../../api/interface/swallowInterface'
import styled from "@emotion/styled";


const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
const { Step } = Steps

//handle history_data
const handleHistoryData = (history_data: IHistoryItem[]) => {
    const historyNodes:IHistoryNode[] = Array.from(new Set(history_data.map(i => i.task_name))).map(task_name => {
      return {
        task_name,
        approvals: []
      }
    })
    history_data.forEach(item => {
      const historyNode = historyNodes.find(node => node.task_name === item.task_name)
      historyNode?.approvals.push(item)
    })
    return historyNodes
}

//handle pending_data
const handlePendingData = (pending_data: IPendingItem[]) => {
  const pendingNodes:IPendingNode[] = Array.from(new Set(pending_data.map(i => i.task_name))).map(task_name => {
    return {
      task_name,
      handlers: []
    }
  })
  pending_data.forEach(item => {
    const historyNode = pendingNodes.find(node => node.task_name === item.task_name)
    historyNode?.handlers.push(item)
  })
  return pendingNodes
}

//handle single history process node
const handleApprovals = (approvals: IHistoryItem[]): JSX.Element => 
<div className='d-f fd-c'>
  {
    approvals.map(({ step_user, step_user_name, step_action_name, step_approval_time, submit_source }) => {
      return (
        <ApprovalDiv key={step_user}>
          <span>{`${step_user}(${step_user_name})`}</span>
          <strong>{step_action_name}</strong>
          <span>{step_approval_time}</span>
          <span>{submit_source}</span>
        </ApprovalDiv>
      )
    })
  }
</div>

//handle single pending process node
const handleWait = (wait: IPendingItem[]): JSX.Element => 
<div className='w80'>    
  {
    wait.map(({handler, handler_name}) => {
      return (
        <WaitDiv key={handler}>
          <span>{`${handler}(${handler_name})`}</span>
          <strong>待审批</strong>
        </WaitDiv>
      )
    })
  }    
</div>

export default function OrderStatus() {
  const [projectId, setProjectId] = useState<string | undefined>('')
  const [loading, setLoading] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [historyList, setHistoryList] = useState<IHistoryNode[] | null>(null)
  const [pendingList, setPndingList] = useState<IPendingNode[] | null>(null)

  const fetchData = () => {
    setLoading(true)
    const instanceId = projectId
    getOrderStatus({instanceId}).then(res => {
      if (res.data.data && res.data.data.instance_detail) {
        setHasData(true)
        const { history_data, pending_data } = res.data.data.instance_detail
        setHistoryList(handleHistoryData(history_data))
        setPndingList(handlePendingData(pending_data))
      }
      else {
        setHasData(false)
      }
    }).finally(() => {
      setLoading(false)
    });
  }

  return (
    <>
      <TitleHeader title="工单状态查看" />
      <div className='d-f mt16 mb26'>
        <div className="mr16 d-f ac">
          <span className="ta-r s0 mr10" style={{ width: 80 }}>项目ID</span>
          <Input onPressEnter={fetchData} placeholder="项目ID" style={{ width: 256 }} value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        </div>
        <Button type="primary" onClick={fetchData}>
          搜索
        </Button>
      </div>
      <Spin indicator={loadingIcon} spinning={loading}>
        <div className='d-f ml40 ptb20' style={{width: '500px'}} >
          {
            hasData ?
            <CustomSteps direction="vertical" current={historyList? historyList.length - 1 : 0} progressDot>
              {/* 审批历史 */}
              {
                historyList?.map(({ task_name, approvals }) => {
                  return (
                    <Step key={task_name} title={task_name} description={handleApprovals(approvals)} />
                  )
                })
              }
              {/* 等待审批 */}
              {
                pendingList?.map(({ task_name, handlers }) => {
                  return (
                    <Step key={task_name} title={task_name} description={handleWait(handlers)} />
                  )
                })
              }
            </CustomSteps>    
              :
            <Empty />
          }
        </div>
      </Spin>
    </>
  )
}

const CustomSteps = styled(Steps)`
  width: 100%;
  & .ant-steps-item-tail::after {
    width: 2px !important;
    margin-left: 12px !important;
  }
  & .ant-steps-item-wait {
    opacity: .7;
  }
  & .ant-steps-item-title {
    font-weight: bold;
  }
`;

const ApprovalDiv = styled.div`
  display: flex;
  color: #000000;
  &>strong {
    color: #1672fa;
  }
  &>* {
    margin-right: 10px;
  }
`;

const WaitDiv = styled.div`
  &>span {
    margin-right: 10px;
  }
  &>strong {
    color: #1672fa;
  }
`;