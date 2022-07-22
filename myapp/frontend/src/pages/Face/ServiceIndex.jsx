import React from 'react'


export default function ServiceIndex() {
  return (
    <div className="d-f jc home-wrapper bg-w">
      <div className="home-wrapper-container pb48">
        <div className="ta-c">
          <span className="home-title">服务指标</span>
        </div>
        <div className="d-f jc-b">
          <div className="ta-c flex1 s0">
            <div className="c-text-b"><strong className="fs48">5</strong><span className="fs16">千</span></div>
            <div className="fs20">图表数量</div>
          </div>
          <div className="ta-c flex1 s0">
            <div className="c-text-b"><strong className="fs48">5.53</strong><span className="fs16">万</span></div>
            <div className="fs20">看板数量</div>
          </div>
          <div className="ta-c flex1 s0">
            <div className="c-text-b"><strong className="fs48">458</strong><span className="fs16">万</span></div>
            <div className="fs20">每月sql查询数</div>
          </div>
        </div>
      </div>
    </div>
  )
}
