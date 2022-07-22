import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Button, Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ClockCircleOutlined, DatabaseOutlined, DotChartOutlined, PictureOutlined, PieChartOutlined, RightOutlined, TagsOutlined, UserSwitchOutlined } from "@ant-design/icons";

export default function StartPortrayal() {
  return (
    <div className="home-page-wrapper" style={{ backgroundColor: '#f7f9fc' }}>
      <div className="home-page" style={{ height: '100vh', maxHeight: 900 }}>
        <div className="ta-c pb64">
          <h1 className="fs32">星画</h1>
          <div className="fs18">用户画像</div>
        </div>
        <ScrollOverPack
          id="page2"
          style={{ backgroundColor: '#f7f9fc' }}
        >
          <div className="d-f ac jc-b">
            <div className="image-wrapper page2-image pt32">
              <TweenOne
                key="image"
                animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                style={{ transform: 'translateX(100px)', opacity: 0 }}
              >
                <Row gutter={[32, 32]}>
                  <Col span={8}>
                    <a className="feature7-block-group">
                      <div name="image" className="feature7-block-image">
                        <DatabaseOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">集团标签知识库</h1>
                      <div name="content" className="feature7-block-content">集成QQ音乐、全民K歌、酷狗、酷我、懒人用户数据，构建集团统一标签体系，让标签更好用。</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group">
                      <div name="image" className="feature7-block-image">
                        <UserSwitchOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">用户OneID体系</h1>
                      <div name="content" className="feature7-block-content">基于用户的q36设备ID、uin个人信息挖掘进行用户打通，构建完整的集团设备账号IDMapping转换体系，实现多业务线数据共享</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group">
                      <div name="image" className="feature7-block-image">
                        <TagsOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">标签生产引擎</h1>
                      <div name="content" className="feature7-block-content">对接集团所有业务线，通过人机协同的方式，以多种标签挖掘生成方式，满足更加丰富场景和需求的个性化标签</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group">
                      <div name="image" className="feature7-block-image">
                        <PieChartOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">用户全景画像</h1>
                      <div name="content" className="feature7-block-content">提供300+维度用户画像特征交叉分析，对单个用户或群体用户，提供画像特征洞察服务，辨别用户群的独特性，助力业务精细化分析</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group">
                      <div name="image" className="feature7-block-image">
                        <DotChartOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">用户分群圈选</h1>
                      <div name="content" className="feature7-block-content">支持用户自定义圈人人群，提供在线和离线号码包，让圈人变得更简单</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group">
                      <div name="image" className="feature7-block-image">
                        <ClockCircleOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">低延迟的数据服务</h1>
                      <div name="content" className="feature7-block-content">提供低延迟(小于20ms)去隐私化的标签画像特征在线服务，赋能集团众多业务场景，如推荐冷启动、活动运营等，发挥数据更大的价值</div>
                    </a>
                  </Col>
                </Row>
              </TweenOne>
            </div>
            <QueueAnim
              className="text-wrapper"
              key="text"
              duration={450}
              type="bottom"
              leaveReverse
            >
              <div key="xinhua" style={{ paddingLeft: 200 }}>
                <img src={require('../../images/xinghua.png')} style={{ height: 150, width: 'auto' }} className="mb16" />
                {/* <h2 key="h2">星画 用户画像</h2> */}
                <p style={{ maxWidth: 260 }}>TME星画平台是面向业务的全域用户标签画像管理平台，建立统一的用户标签体系和画像系统，通过标签可视化、画像洞察和人群圈选等综合能力，助力业务增长</p>
                <div>
                  <a>
                    <Button type="primary" size="large" onClick={() => {
                      window.open('http://tagstar.tmeoa.com/')
                    }}>
                      了解更多
                    <RightOutlined />
                    </Button>
                  </a>
                </div>
              </div>
            </QueueAnim>
          </div>
        </ScrollOverPack>
      </div>
    </div>
  );
}
