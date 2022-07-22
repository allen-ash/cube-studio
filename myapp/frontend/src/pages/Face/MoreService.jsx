import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Row, Col } from 'antd';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';

class MoreService extends React.PureComponent {
  render() {
    return (
      <div className="home-page-wrapper" style={{ backgroundColor: '#f7f9fc' }}>
        <div className="home-page" style={{ height: '100vh', maxHeight: 700 }}>
          <div className="ta-c pb64">
            <h1 className="fs32">更多服务</h1>
          </div>
          <OverPack>
            <QueueAnim
              type="bottom"
              key="block"
              leaveReverse
            >
              <Row key="moreService" justify="space-between">
                <Col span={6}>
                  <div className="ta-c mlr32 cp" onClick={()=>{
                    window.open('http://swallow.music.woa.com/')
                  }}>
                    <div>
                      <div name="image">
                        <img src={require('../../images/swallow.svg').default} alt="img" className="w128 mb16" />
                      </div><h1 name="title" className="content0-block-title jzj8xt5kgv7-editor_css">Swallow</h1>
                      <div name="content" className="jzj8z9sya9-editor_css">一站式快速、轻便的TB、PB级数据仓库解决方案 , 提供高效的实时离线数据集成,数据开发,调度运维等产品服务，高效并经济地分析处理海量数据，帮助用户专注于数据价值的挖掘和探索</div>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="ta-c mlr32" >
                    <div>
                      <div name="image">
                        <img src={require('../../images/database1.svg').default} alt="img" className="w128 mb16" />
                      </div><h1 name="title" className="content0-block-title jzj8xt5kgv7-editor_css">MusicHouse</h1>
                      <div name="content" className="jzj8z9sya9-editor_css">提供一站式安全可靠的PB级海量数据极速分析与计算服务</div>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="ta-c mlr32" >
                    <div>
                      <div name="image">
                        <img src={require('../../images/idmapping.svg').default} alt="img" className="w128 mb16" />
                      </div><h1 name="title" className="content0-block-title jzj8xt5kgv7-editor_css">IDMapping</h1>
                      <div name="content" className="jzj8z9sya9-editor_css">打通不同业务中同一个自然人对象，了解特定用户在使用不同产品中的行为，打破信息壁垒。</div>
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="ta-c mlr32" >
                    <div>
                      <div name="image">
                        <img src={require('../../images/cost.svg').default} alt="img" className="w128 mb16" />
                      </div><h1 name="title" className="content0-block-title jzj8xt5kgv7-editor_css">数据成本平台</h1>
                      <div name="content" className="jzj8z9sya9-editor_css">敬请期待</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </QueueAnim>
          </OverPack>
        </div>
      </div>
    );
  }
}

export default MoreService;
