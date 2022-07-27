import { Button } from 'antd'
import React from 'react'
import { IAppMenuItem } from '../api/interface/kubeflowInterface'

export default function Page404() {
    return (
        <div className="d-f jc ac h100 fade-in">
            <div className="ta-c">
                <div><img className="w512" src={require('../images/workData.png')} alt=""/></div>
                {/* <div>
                    <img className="pb32 w256" src={require('../images/star.svg').default} alt="" />
                </div> */}
                <div className="fs16">Wellcome to cube数据平台 | 如遇到使用问题，可以联系管理员 </div>
            </div>
        </div>
    )
}
