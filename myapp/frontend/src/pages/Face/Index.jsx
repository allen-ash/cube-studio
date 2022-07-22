/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import Header from './Header';
import Banner from './Banner';
import ServiceIndex from './ServiceIndex';
import Feature7 from './Feature7';
import MoreService from './MoreService';
import FunctionPipeline from './FunctionPipeline';
import Footer from './Footer';
import Superset from './Superset'
import StartPortrayal from './StartPortrayal'
import MyTeam from './MyTeam'

import {
  Nav20DataSource,
  Banner50DataSource,
  Feature60DataSource,
  Feature70DataSource,
  Feature00DataSource,
  Feature80DataSource,
  Footer10DataSource,
} from './data.source';
import './less/antMotionStyle.less';
import WaveComponent from '../../components/WaveShader/WaveComponent';
import Earth from '../../components/earth/Earth';
import MachineLearning from './MachineLearning';

const { location = {} } = typeof window !== 'undefined' ? window : {};

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
    };
  }

  render() {

    return (
      <div
        className="templates-wrapper fade-in"
        style={{ height: '100%' }}
        ref={(d) => {
          this.dom = d;
        }}
        id="indexContainer"
      >
        
        <div className="wave-bg"><Earth /></div>
        <div className="wave-bg"><WaveComponent /></div>
        <Banner
          id="Banner5_0"
          key="Banner5_0"
          dataSource={Banner50DataSource}
          isMobile={this.state.isMobile}
        />
        <ServiceIndex
          id="Feature6_0"
          key="Feature6_0"
          dataSource={Feature60DataSource}
          isMobile={this.state.isMobile}
        />
        <Superset />
        {/* <StartPortrayal />
        <MachineLearning />
        <MoreService
          id="Feature0_0"
          key="Feature0_0"
          dataSource={Feature00DataSource}
          isMobile={this.state.isMobile}
        />
        <FunctionPipeline
          id="Feature8_0"
          key="Feature8_0"
          dataSource={Feature80DataSource}
          isMobile={this.state.isMobile}
        /> */}
        <Footer
          id="Footer1_0"
          key="Footer1_0"
          dataSource={Footer10DataSource}
          isMobile={this.state.isMobile}
        />
      </div>
    );
  }
}
