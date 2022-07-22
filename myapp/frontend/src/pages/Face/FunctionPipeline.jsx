import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { Carousel as AntCarousel, Row, Col } from 'antd';
import { ArrowRightOutlined, CalendarOutlined, ExperimentOutlined, LikeOutlined, WechatOutlined } from '@ant-design/icons';

class FunctionPipeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.carouselRef = React.createRef();
    this.state = {
      current: 0,
    };
  }

  onTitleClick = (_, i) => {
    const carouselRef = this.carouselRef.current.childRefs.carousel;
    carouselRef.goTo(i);
  };

  onBeforeChange = (_, newIndex) => {
    this.setState({
      current: newIndex,
    });
  };

  getChildrenToRender = (dataSource) => {
    const { current } = this.state;
    const { Carousel, childWrapper: buttonWrapper } = dataSource;
    const { children: carouselChild, wrapper, ...carouselProps } = Carousel;
    const {
      titleWrapper,
      children: childWrapper,
      ...childrenProps
    } = carouselChild;

    const {
      barWrapper,
      title: titleChild,
      ...titleWrapperProps
    } = titleWrapper;
    const titleToRender = [];

    const childrenToRender = childWrapper.map((item, ii) => {
      const { title, children: childRow, ...rowProps } = item;
      if (childWrapper.length > 1) {
        titleToRender.push(
          <div
            {...title}
            key={ii.toString()}
            onClick={(e) => {
              this.onTitleClick(e, ii);
            }}
            className={
              ii === current
                ? `${title.className || ''} active`
                : title.className
            }
          >
            {title.children}
          </div>
        );
      }
      const images = [
        <WechatOutlined style={{ color: '#1890ff', fontSize: 48 }} />,
        <CalendarOutlined style={{ color: '#1890ff', fontSize: 48 }} />,
        <ExperimentOutlined style={{ color: '#1890ff', fontSize: 48 }} />,
        <LikeOutlined style={{ color: '#1890ff', fontSize: 48 }} />
      ]
      const childrenItem = childRow.map(($item, i) => {
        const { children: colChild, arrow, ...colProps } = $item;
        const { ...childProps } = colChild;
        return (
          <Col {...colProps} key={i.toString()}>
            <div {...childProps}>
              <div className="ta-c">
                {colChild.children.map((item) => {
                  switch (item.name) {
                    case 'image':
                      return images[i]
                    case 'title':
                      return <h3 className="pt16">{item.children}</h3>
                    case 'content':
                      return <div>{item.children}</div>
                    default:
                      return ''
                  }
                })}
              </div>
            </div>
            {arrow && (
              <div {...arrow}>
                <ArrowRightOutlined style={{ color: '#1890ff' }} />
              </div>
            )}
          </Col>
        );
      });

      return (
        <div key={ii.toString()}>
          <QueueAnim
            component={Row}
            type="bottom"
            componentProps={{ type: 'flex' }}
            {...rowProps}
          >
            {childrenItem}
          </QueueAnim>
        </div>
      );
    });

    return (
      <QueueAnim
        key="queue"
        type="bottom"
        ref={this.carouselRef}
        {...childrenProps}
      >
        {childWrapper.length > 1 && (
          <div {...titleWrapperProps} key="title">
            <div {...titleChild}>{titleToRender}</div>
          </div>
        )}
        <AntCarousel
          key="carousel"
          {...carouselProps}
          infinite={false}
          beforeChange={this.onBeforeChange}
        >
          {childrenToRender}
        </AntCarousel>
      </QueueAnim>
    );
  };

  render() {
    const { dataSource, isMobile, ...props } = this.props;
    const { titleWrapper } = dataSource;
    return (
      <div {...props} {...dataSource.wrapper} >
        <div {...dataSource.page}>
          <div className="ta-c pb64">
            <h1 className="fs32">需求流程</h1>
            <div className="fs18">流程简单清晰，快速响应需求</div>
          </div>
          <OverPack {...dataSource.OverPack}>
            {this.getChildrenToRender(dataSource)}
          </OverPack>
        </div>
      </div>
    );
  }
}
export default FunctionPipeline;
