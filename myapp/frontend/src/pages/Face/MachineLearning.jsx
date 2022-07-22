import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Button, Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ClockCircleOutlined, DatabaseOutlined, DotChartOutlined, PictureOutlined, PieChartOutlined, RightOutlined, TagsOutlined, UserSwitchOutlined } from "@ant-design/icons";

export default function MachineLearning() {
  return (
    <div className="home-page-wrapper">
      <div className="home-page" style={{ height: '100vh', maxHeight: 900 }}>
        <div className="ta-c pb64">
          <h1 className="fs32">机器学习平台</h1>
          <div className="fs18">CubeStudio 机器学习</div>
        </div>

        <ScrollOverPack
          id="page2"
        >
          <div className="d-f ac jc-b">
            <QueueAnim
              className="text-wrapper mr64"
              style={{ paddingLeft: 100 }}
              key="text"
              duration={450}
              type="bottom"
              leaveReverse
            >
              <div key="machineLearn">
                <img src={require('../../images/machine.png')} style={{ height: 150, width: 'auto' }} className="mb16" />
                {/* <h2 key="h2">星画 用户画像</h2> */}
                <p style={{ maxWidth: 260 }}>TME CubeStudio旨在为AI开发者打造一款一站式、沉浸式、高性能的大规模建模机器学习平台，基于数据+算法双引擎，快速支撑建模业务，助力数据智能化落地升级</p>
                <div>
                  <a>
                    <Button type="primary" size="large" onClick={() => {
                      window.open('http://kubeflow.tke.woa.com/')
                    }}>
                      了解更多
                    <RightOutlined />
                    </Button>
                  </a>
                </div>
              </div>
            </QueueAnim>

            <div className="image-wrapper page2-image pt32 w100">
              <TweenOne
                key="image"
                animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                style={{ transform: 'translateX(100px)', opacity: 0 }}
              >
                <Row gutter={[32, 32]}>
                  <Col span={8}>
                    <a className="feature7-block-group" style={{ borderRadius: 10 }}>
                      <div name="image" className="feature7-block-image">
                        <DatabaseOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">高性能分布式训练</h1>
                      <div name="content" className="feature7-block-content">集成并优化TensorFlow、Pytorch、Kaldi等计算框架，内置大规模稀疏化，支撑TB级大规模特征处理(coming soon)等场景化算子，高效支撑推荐、音视频、安全等训练计算场景。</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group" style={{ borderRadius: 10 }}>
                      <div name="image" className="feature7-block-image">
                        <UserSwitchOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">沉浸式的建模体验</h1>
                      <div name="content" className="feature7-block-content">提供沉浸式的模型开发训练编程体验，功能覆盖算法开发、模型训练评估、在线推理预测建模全流程。</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group" style={{ borderRadius: 10 }}>
                      <div name="image" className="feature7-block-image">
                        <TagsOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">丰富的模型特征</h1>
                      <div name="content" className="feature7-block-content">统一的全集团用户画像、音视频特征数据管理，管理结构化，非结构化等多源异构数据，提供从数据到模型极致模型训练体验。</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group" style={{ borderRadius: 10 }}>
                      <div name="image" className="feature7-block-image">
                        <PieChartOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">开放的算法组件</h1>
                      <div name="content" className="feature7-block-content">提供开放共享标准化的算法模型组件接入，提供集团推荐、音视频、安全多场景下的算法共享市场，公共算法组件模板镜像 70+，开放式的工作训练pipeline引擎设计，自由协同多个机器学习平台。</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group" style={{ borderRadius: 10 }}>
                      <div name="image" className="feature7-block-image">
                        <DotChartOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">弹性的资源调度能力</h1>
                      <div name="content" className="feature7-block-content">提供全集团统一的GPU资源算力调度平台，支持模型平滑升级、弹性扩缩容、模型失效监测等服务。</div>
                    </a>
                  </Col>
                  <Col span={8}>
                    <a className="feature7-block-group" style={{ borderRadius: 10 }}>
                      <div name="image" className="feature7-block-image">
                        <ClockCircleOutlined style={{ fontSize: 20 }} />
                      </div>
                      <h1 name="title" className="feature7-block-title">低延迟在线推理服务</h1>
                      <div name="content" className="feature7-block-content">充分利用网络带宽和后端引擎计算能力，提供秒级别的精排模型计算服务能力，满足推荐、搜索、广告等低延时场景。</div>
                    </a>
                  </Col>
                </Row>
              </TweenOne>
            </div>
          </div>
        </ScrollOverPack>
      </div>
    </div>
  );
}
