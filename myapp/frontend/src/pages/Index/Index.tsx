import { GithubOutlined, QuestionCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import React from 'react'
import WaveComponent from '../../components/WaveShader/WaveComponent';
import Footer from './Footer';
import './index.less';
import MainServer from './MainServer';

export default function Index() {

    return (
        <div className="bg-w fadeIn">
            <div className="banner p-r banner-bg ov-h">
                <div className="wave-bg"><WaveComponent /></div>

                {/* <div className="dec-rect">
                    <div className="dec-rect-title">星云数据平台</div>
                    <div className="dec-rect-content">数据资产服务旗下有星画，Superset，Swallow，等多款数据产品</div>
                </div>
                <div>
                    <div className="dec-reddot"></div>
                </div>
                <div>
                    <div className="dec-star">STAR Data Platform</div>
                </div>
                <div>
                    <div className="desc-icon d-f fd-c">
                        <GithubOutlined className="mb12" style={{ fontSize: 24 }} />
                        <QuestionCircleOutlined style={{ fontSize: 24 }} />
                    </div>
                </div> */}

                {/* <div>
                    <img className="airplane" src={require('../../images/index/airplane.svg').default} alt="" />
                </div> */}
                {/* <div>
                    <img className="cloud cloud1" src={require('../../images/index/cloud.png')} alt="" />
                    <img className="cloud cloud2" src={require('../../images/index/cloud.png')} alt="" />
                </div> */}
                {/* <img className="dec-bottom" src={require('../../images/index/home-shap.png')} alt="" /> */}
                {/* <img className="w64 dec-tree" src={require('../../images/index/tree.svg').default} alt="" /> */}

                <div className="h100 d-f ac jc p-r z1">
                    <div className="banner-main d-f ac jc-b s0" style={{ width: 1400 }}>
                        <div className="dec-text">
                            <div>
                                <img src={require('../../images/logoStar.svg').default} alt="" />
                            </div>
                            <div className="dec-maintext">星云数据平台</div>
                            <div className="fs20">
                                TME 一站式集团数据融合平台
                        </div>
                            <div>
                                <div className="dec-more" onClick={() => {
                                    window.open('https://iwiki.woa.com/space/TMEDI', 'bank')
                                }}>
                                    了解更多
                            </div>
                            </div>
                        </div>
                        <div>
                            <MainServer />
                        </div>
                    </div>
                </div>
            </div>
            <div className="indicator">
                <div className="w1400 d-f ptb32 c-text-w p-r">
                    <div className="lines">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>

                    <div className="ta-c flex1">
                        <div><strong className="fs48">100</strong><span>亿+</span></div>
                        <div className="fs20">日均实时数据处理量</div>
                    </div>
                    <div className="ta-c flex1">
                        <div><strong className="fs48">14</strong><span>亿+</span></div>
                        <div className="fs20">用户资产画像特征</div>
                    </div>
                    <div className="ta-c flex1">
                        <div><strong className="fs48">6</strong><span>万+</span></div>
                        <div className="fs20">数据图卡数量</div>
                    </div>
                    <div className="ta-c flex1">
                        <div><strong className="fs48">70</strong><span>+</span></div>
                        <div className="fs20">开放算法组件</div>
                    </div>
                </div>
            </div>

            <div className="w1400 bg-w">
                <div className="c-theme pb32 pt64 ta-c">
                    <div className="fs30">主要服务</div>
                    <div className="fs16 ml8 pt4">Main Server</div>
                </div>
                <div className="d-f fw jc-b server-card-container pt16 pb64">
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">数据接入</strong><span>StarHub</span></div>
                        <div className="pt8">提供稳定高效的数据同步平台，支持十余种异构数据源通过增量或全量方式，在跨业务网络环境下进行高速稳定的数据同步，低成本搭建数据链路，承担业务数据枢纽角色。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">元数据管理</strong><span>StarMeta</span></div>
                        <div className="pt8">元数据管理包含多数据源节点管理，包含US、TDW、SuperSet、Clickhouse等元数据节点；功能覆盖元数据数据管理、数据建模、血缘分析、血缘节点探索等。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">数据探索</strong><span>StarInsight</span></div>
                        <div className="pt8">提供多源数据即席查询、Juptyer数据建模服务，致力于有效解决数据孤岛的问题。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">数据生产</strong><span>StarPipeline</span></div>
                        <div className="pt8">提供开放共享标准化的数据+算法pipeline引擎组件，轻松完成多种类型任务构建，提升全链路研发体验。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">数据引擎</strong><span>StarEngine</span></div>
                        <div className="pt8">提供一站式安全可靠PB级海量数据极速分析与计算服务，致力于提供多引擎融合计算（coming soon）</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">IDMapping</strong><span>StarID</span></div>
                        <div className="pt8">打通不同业务中同一个自然人/设备信息，了解特定用户在使用不同产品中的行为，统一身份标识实现多ID互转，打破信息壁垒。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">机器学习</strong><span>StarML</span></div>
                        <div className="pt8">旨在为AI开发者打造一款一站式、沉浸式、高性能的大规模建模机器学习平台，基于数据+算法双引擎，快速支撑数据算法建模，助力数据智能化落地升级。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">数据可视化</strong><span>StarBI</span></div>
                        <div className="pt8">敏捷灵活的面向产品、运营、数据、技术不同角色，支持多种数据源、PB级秒级实时即席数据探索和数据可视化平台。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">画像特征</strong><span>TagStar</span></div>
                        <div className="pt8">星画平台面向业务提供14亿+用户标签画像特征、标签可视化、画像洞察和人群圈选等综合能力，助力业务增长。</div>
                    </div>
                    <div className="server-card">
                        <div><strong className="fs18 pr8 dot-title">实验平台</strong><span>TAB</span></div>
                        <div className="pt8">TAB旨在降低实验门槛，提供一站式科学实验服务，加速策略落地验证，接入10+业务，7000+ 实验同时在线。</div>
                    </div>
                </div>
            </div>


            <div className="w1400 bg-w">
                <div className="star-divide"></div>
                <div className="c-theme pt4 pb32 d-f">
                    <span className="fs30">StarBI 集团数据可视化平台</span>
                </div>

                <div className="d-f fw jc-b ac pt64 pb128 plr64">
                    <div className="pr128 fs16 flex1">
                        <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">简单易用快速上手</span></div>
                        <div className="pb24 pt4 ti2">
                            面向业务的自助式可视化数据探索分析，用户无需掌握复杂SQL编程，提供40+ 可视化组件，多种布局组件，帮助业务实现丰富的数据展现模式只需简单拖拽即可进行可视化分析。
                        </div>
                        <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">丰富的使用场景</span></div>
                        <div className="pb24 pt4 ti2">
                            数据日报周报自动分发企微、邮件、小程序，第一时间查收数据，接收数据告警，移动端随时随地了解经营数据。
                        </div>
                        <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">强劲的数据计算性能</span></div>
                        <div className="pb24 pt4 ti2">
                            MusicHouse支持多引擎融合查询计算、跨源查询、冷热数据自动迁移等高级特性，日均处理万亿+数据，p95查询时间小于10s，完美支撑大数据高性能计算场景。
                        </div>
                    </div>
                    <div>
                        <img src={require('../../images/index/main-image1.png')} style={{ width: 500 }} />
                    </div>
                </div>

                <div className="w1400 bg-w">
                    <div className="star-divide"></div>
                    <div className="c-theme pt4 pb32 d-f">
                        <span className="fs30">TagStar 星画特征画像洞察平台</span>
                    </div>
                    <div className="d-f fw jc-b ac pt64 pb128 plr64">
                        <img src={require('../../images/index/productive.png')} style={{ width: 500 }} />
                        <div className="fs16 flex1 pl128">
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">集团标签知识库</span></div>
                            <div className="pb24 pt4 ti2">
                                集成QQ音乐、全民K歌、酷狗、酷我、懒人用户数据，构建集团统一标签体系，让标签更好用。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">用户OneID体系</span></div>
                            <div className="pb24 pt4 ti2">
                                基于用户的q36设备ID、个人信息挖掘进行用户打通，构建完整的集团设备账号IDMapping转换体系，实现多业务线数据共享。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">用户全景画像</span></div>
                            <div className="pb24 pt4 ti2">
                                提供300+维度用户画像特征交叉分析，对单个用户或群体用户，提供画像特征洞察服务，辨别用户群的独特性，助力业务精细化分析
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">低延迟的数据服务</span></div>
                            <div className="pb24 pt4 ti2">
                                提供低延迟(小于20ms)去隐私化的标签画像特征在线服务，赋能集团众多业务场景，如推荐冷启动、活动运营等，发挥数据更大的价值。
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w1400 bg-w">
                    <div className="star-divide"></div>
                    <div className="c-theme pt4 pb32 d-f">
                        <span className="fs30">StarMeta 全域元数据血缘链路平台</span>
                    </div>
                    <div className="d-f fw jc-b ac pt64 pb128 plr64">
                        <div className="pr128 fs16 flex1">
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">元数据管理</span></div>
                            <div className="pb24 pt4 ti2">
                                集成QQ音乐、全民K歌、酷狗、酷我、懒人数据仓库，构建全域统一规范的数据主题域。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">指标管理</span></div>
                            <div className="pb24 pt4 ti2">
                                集团指标口径规范管理，计算任务关联管理，对各类上线任务及其产生的实例进行统一运维、统一监控、统一管理，保障任务上线后的稳定、高效。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">数据血缘</span></div>
                            <div className="pb24 pt4 ti2">
                                图形化全链路数据表管理工具，字段、分区级元数据血缘展示，为用户提供从数据发现-数据理解-资产管理的一站式大数据服务。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">数据安全(coming soon)</span></div>
                            <div className="pb24 pt4 ti2">
                                可靠的安全管理体系，通过对表数据的权限的控制、风险与审计、数据保护等方式，全方位保障大数据生命周期的隐私合规和资产安全。
                            </div>
                        </div>
                        <img src={require('../../images/workData.png')} style={{ width: 500 }} />
                    </div>
                </div>

                <div className="w1400 bg-w">
                    <div className="star-divide"></div>
                    <div className="c-theme pt4 pb32 d-f">
                        <span className="fs30">StarML 机器学习平台</span>
                        {/* <span className="fs16 ml8 pt4">StarEngine</span> */}
                    </div>
                    <div className="d-f fw jc-b ac pt64 pb128 plr64">
                        <img src={require('../../images/runData.png')} style={{ width: 500 }} />
                        <div className="fs16 flex1 pl128">
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">高性能分布式训练</span></div>
                            <div className="pb24 pt4 ti2">
                                集成并优化TensorFlow、Pytorch、Kaldi等计算框架，高效支撑推荐、音视频、安全等训练计算场景。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">沉浸式的建模体验</span></div>
                            <div className="pb24 pt4 ti2">
                                提供沉浸式的模型开发训练编程体验，功能覆盖算法开发、模型训练评估、在线推理预测建模全流程。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">丰富的模型特征</span></div>
                            <div className="pb24 pt4 ti2">
                                统一的全集团用户画像、音视频特征数据管理，管理结构化，非结构化等多源异构数据，提供从数据到模型极致模型训练体验。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">弹性的资源调度能力</span></div>
                            <div className="pb24 pt4 ti2">
                                提供全集团统一的GPU资源算力调度平台，支持模型平滑升级、弹性扩缩容、模型失效监测等服务。
                            </div>
                            <div><span className="c-text-w bg-theme ptb4 pl8 w256 d-il fs20">低延迟在线推理服务</span></div>
                            <div className="pb24 pt4 ti2">
                                充分利用网络带宽和后端引擎计算能力，提供秒级别的精排模型计算服务能力，满足推荐、搜索、广告等低延时场景。
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
