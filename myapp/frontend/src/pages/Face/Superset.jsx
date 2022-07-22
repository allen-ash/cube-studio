import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { RightOutlined } from "@ant-design/icons";

export default function Superset() {
  return (
    <div className="d-f jc home-wrapper home-page-bg">
      <div className="home-wrapper-container pb48 pt64">

        <div className="d-f jc ac">
          <div style={{ minWidth: 300 }}>
            <div className="fs32 c-text-b pb16">敏捷分析</div>
            <div className="pr48 fs16" style={{ lineHeight: '28px' }}>
              Superset是一款敏捷灵活的面向产品、运营、数据、技术不同觉，支持多种数据源、PB级秒级实时即席数据探索和数据可视化平台
            </div>
            <div className="c-theme pt16 fs16">
              <a href="https://iwiki.woa.com/space/supersetHelp" target='_blank'>常见问题Q&A</a>
            </div>
            <div className="pt8">
              <Button type='primary' size='large' onClick={() => {
                window.open('http://superset.tmeoa.com/', 'blank')
              }}>前往探索<RightOutlined /></Button>
            </div>
          </div>
          <div style={{ maxWidth: 1000, width: '100%' }} >
            <Carousel
              autoPlay
              interval={3000}
              infiniteLoop
              stopOnHover
              showThumbs={false}
              showStatus={false}>
              <div>
                <TweenOne
                  key="image"
                  animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                  style={{ transform: 'translateX(100px)', opacity: 0 }}
                >
                  <img src={require('../../images/supersetDemo01.png')} style={{ height: 500, width: 'auto' }} />
                </TweenOne>
              </div>
              <div>
                <TweenOne
                  key="image"
                  animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                  style={{ transform: 'translateX(100px)', opacity: 0 }}
                >
                  <img src={require('../../images/supersetDemo02.png')} style={{ height: 500, width: 'auto' }} />
                </TweenOne>
              </div>
              <div>
                <TweenOne
                  key="image"
                  animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                  style={{ transform: 'translateX(100px)', opacity: 0 }}
                >
                  <img src={require('../../images/supersetDemo03.png')} style={{ height: 500, width: 'auto' }} />
                </TweenOne>
              </div>
              <div>
                <TweenOne
                  key="image"
                  animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                  style={{ transform: 'translateX(100px)', opacity: 0 }}
                >
                  <img src={require('../../images/supersetDemo04.png')} style={{ height: 500, width: 'auto' }} />
                </TweenOne>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
