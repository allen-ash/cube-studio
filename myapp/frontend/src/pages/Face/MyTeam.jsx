import React from 'react';
import TweenOne from 'rc-tween-one';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { RightOutlined } from "@ant-design/icons";

export default function MyTeam() {
  return (
    <div className="home-page-wrapper" style={{ backgroundColor: '#f7f9fc' }}>
      <div className="home-page" style={{ height: '100vh', maxHeight: 900 }}>
        <ScrollOverPack
          id="page2"
        >
          <div className="d-f ac jc">
            <QueueAnim
              className="text-wrapper left-text s0"
              style={{ marginRight: 128 }}
              key="text"
              duration={450}
              type="bottom"
              leaveReverse
            >
              <h2 key="h2">我们的团队</h2>
              <p key="p" style={{ maxWidth: 260 }}>我们的团队由一群有活力，积极向上的小伙伴组成，欢迎大家积极沟通。</p>
              {/* <p><a key="p" style={{ maxWidth: 260 }}></a></p> */}
              <div key="button">
                <a>
                  <Button type="primary" size="large" onClick={()=>{
                    window.open('http://metaview.tmeoa.com/#footer')
                  }}>
                    联系我们
                    <RightOutlined />
                  </Button>
                </a>
              </div>
            </QueueAnim>

            <div className="s0" style={{ width: 900 }}>
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
                    <img src={require('../../images/we01.jpeg')} style={{ height: 600, width: 'auto' }} />
                  </TweenOne>
                </div>
                <div>
                  <TweenOne
                    key="image"
                    animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                    style={{ transform: 'translateX(100px)', opacity: 0 }}
                  >
                    <img src={require('../../images/we02.jpeg')} style={{ height: 600, width: 'auto' }} />
                  </TweenOne>
                </div>
                <div>
                  <TweenOne
                    key="image"
                    animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
                    style={{ transform: 'translateX(100px)', opacity: 0 }}
                  >
                    <img src={require('../../images/we03.jpeg')} style={{ height: 600, width: 'auto' }} />
                  </TweenOne>
                </div>
              </Carousel>
            </div>
          </div>
        </ScrollOverPack>
      </div>
    </div>
  );
}
