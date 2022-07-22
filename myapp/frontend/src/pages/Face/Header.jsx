import React from 'react';
import TweenOne from 'rc-tween-one';
import { Link } from 'rc-scroll-anim';
import { Menu, Layout } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import Cookies from 'js-cookie'
import { DownOutlined } from '@ant-design/icons';
const { Header } = Layout;
const userName = Cookies.get('x-rtx')

class CustomHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneOpen: false,
    };
  }

  phoneClick = () => {
    const phoneOpen = !this.state.phoneOpen;
    this.setState({
      phoneOpen,
    });
  };

  render() {
    const { dataSource, isMobile, ...props } = this.props;

    const { phoneOpen } = this.state;
    const { LinkMenu } = dataSource;

    const moment = phoneOpen === undefined ? 300 : null;
    return (
      <TweenOne
        component="header"
        animation={{ opacity: 0, type: 'from' }}
        {...dataSource.wrapper}
        {...props}
      >
        <div
          {...dataSource.page}
          className={`${dataSource.page.className}${phoneOpen ? ' open' : ''}`}
        >
          <div className="d-f ac">
            <TweenOne
              animation={{ x: -30, type: 'from', ease: 'easeOutQuad' }}
              className='header-logo'
            >
              <img width="100%" src={require("../../images/logo.svg").default} alt="img" />
            </TweenOne>
            {isMobile && (
              <div
                {...dataSource.mobileMenu}
                onClick={() => {
                  this.phoneClick();
                }}
              >
                <em />
                <em />
                <em />
              </div>
            )}
            <TweenOne
              {...LinkMenu}
              animation={
                isMobile
                  ? {
                    height: 0,
                    duration: 300,
                    onComplete: (e) => {
                      if (this.state.phoneOpen) {
                        e.target.style.height = 'auto';
                      }
                    },
                    ease: 'easeInOutQuad',
                  }
                  : null
              }
              moment={moment}
              reverse={!!phoneOpen}
            >
              <Header style={{ background: 'transparent' }}>
                <Menu mode="horizontal">
                  <SubMenu title={<span><span className="pr4">数据洞察</span><DownOutlined /></span>} >
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fdata%2Foffline_data%2Fmetadata_table" target="_blank">数据资产</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fdata%2Fdata_pipeline%2Fus_pipeline" target="_blank">数据开发</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fdata%2Foffline_data%2Fmetadata_table" target="_blank">数据集成</a></Menu.Item>
                  </SubMenu>
                  <SubMenu title={<span><span className="pr4">敏捷分析</span><DownOutlined /></span>} >
                    <Menu.Item><a href="http://superset.music.oa.com/" target="_blank">Superset</a></Menu.Item>
                    <Menu.Item><a href="https://datatalk.beacon.woa.com/" target="_blank">Datatalk</a></Menu.Item>
                  </SubMenu>
                  <SubMenu title={<span><span className="pr4">机器学习</span><DownOutlined /></span>} >
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fdev%2Fnotebook" target="_blank">模型开发</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Ftrain%2Ftrain_template%2Fdocker_repository" target="_blank">分布式训练</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fservice%2Ftrain_model" target="_blank">在线推理</a></Menu.Item>
                  </SubMenu>
                  {/* <SubMenu title={<span><span className="pr4">推荐平台</span><DownOutlined /></span>} >
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fdev%2Fnotebook" target="_blank">召回引擎</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Ftrain%2Ftrain_template%2Fdocker_repository" target="_blank">排序引擎</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fservice%2Ftrain_model" target="_blank">推荐DSL</a></Menu.Item>
                    <Menu.Item><a href="http://kubeflow.tke.woa.com/myapp/frontend#/?pathUrl=%2Fservice%2Ftrain_model" target="_blank">推荐Debug</a></Menu.Item>
                  </SubMenu> */}
                  {/* <Menu.Item><a href="http://superset.music.oa.com/" target="_blank">敏捷分析</a></Menu.Item>
                  <Menu.Item><a href="http://kubeflow.tke.woa.com/" target="_blank">机器学习平台</a></Menu.Item>
                  <SubMenu title={<span><span className="pr4">数据资产</span><DownOutlined /></span>} >
                    <Menu.Item><a href="http://tagstar.tmeoa.com/" target="_blank">星画</a></Menu.Item>
                    <Menu.Item>IDMapping</Menu.Item>
                  </SubMenu>
                  <Menu.Item><a href="http://swallow.music.woa.com/" target="_blank">数据开发</a></Menu.Item>
                  <Menu.Item>数据成本(开发中)</Menu.Item> */}
                </Menu>
              </Header>
            </TweenOne>
          </div>
          <div className="c-text-w">
            <img className="mr8" style={{ borderRadius: 200 }} src={`http://tpp.tmeoa.com/photo/48/${userName}.png`} alt="img" />
            <span>{userName}</span>
          </div>
        </div>
      </TweenOne>
    );
  }
}

export default CustomHeader;
