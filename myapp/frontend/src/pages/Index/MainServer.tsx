import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function MainServer() {
    const navigate = useNavigate();

    return (
        <div className="d-f jc ac ptb96 mr64 s0">
            <div className="mainserver-container">
                <svg viewBox="0 0 850 500" width="850px" height="500px" className="circle-out">
                    <defs>
                        <linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0" stop-color="#0ed3ac" />
                            <stop offset="1" stop-color="#0057fe" />
                        </linearGradient>
                    </defs>
                    <rect rx="250" width="850" height="500" fill="transparent" stroke="url(#color1)" stroke-dasharray="10 10" stroke-width="2" />
                </svg>
                <svg viewBox="0 0 610 260" width="610px" height="260px" className="circle-in">
                    <defs>
                        <linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0" stop-color="#0ed3ac" />
                            <stop offset="1" stop-color="#0057fe" />
                        </linearGradient>
                    </defs>
                    <rect rx="130" width="610" height="260" fill="transparent" stroke="url(#color1)" stroke-width="2" />
                </svg>

                <div className="circle-container">
                    <div className="play-top">
                        <div className="triangle-asc"></div>
                        <div className="triangle-asc"></div>
                        <div className="triangle-asc"></div>
                        <div className="triangle-asc"></div>
                        <div className="triangle-asc"></div>
                    </div>

                    <div className="play-bottom">
                        <div className="triangle-desc"></div>
                        <div className="triangle-desc"></div>
                        <div className="triangle-desc"></div>
                        <div className="triangle-desc"></div>
                        <div className="triangle-desc"></div>
                    </div>
                    <div className="text-out-top d-f jc-b">
                        <div className="circle-out-text"
                            onClick={() => {
                                navigate('/data/data_access/data_access_offline')
                            }}>
                            <div>StarHub</div>
                            <div>数据接入</div>
                        </div>
                        <div className="circle-out-text mlr20"
                            onClick={() => {
                                navigate('/data/metadata/metadata_table')
                            }}>
                            <div>StarMeta</div>
                            <div>元数据管理</div>
                        </div>
                        <div className="circle-out-text"
                            onClick={() => {
                                navigate('/data_model/data_sql_select/data_search')
                            }}>
                            <div>StarInsight</div>
                            <div>数据探索</div>
                        </div>
                    </div>
                    <div className="text-out-left">
                        <div className="circle-out-text"
                            onClick={() => {
                                window.open('http://superset.tmeoa.com/', 'bank')
                            }}>
                            <div>StarBI</div>
                            <div>数据可视化</div>
                        </div>
                        {/* <div className="circle-out-text">
                            <div>IDMapping</div>
                        </div> */}
                    </div>
                    <div className="text-out-bottom d-f jc-b">
                        <div className="circle-out-text"
                            onClick={() => {
                                navigate('/train/total_resource')
                            }}>
                            <div>StarML</div>
                            <div>机器学习</div>
                        </div>
                        <div className="circle-out-text mlr20"
                            onClick={() => {
                                window.open('http://tagstar.tmeoa.com/feature/apply', 'bank')
                            }}>
                            <div>StarID</div>
                            <div>IDMapping</div>
                        </div>
                        <div className="circle-out-text"
                            onClick={() => {
                                navigate('/data_model/clickhouse/juno-offline')
                            }}>
                            <div>StarEngine</div>
                            <div>数据引擎</div>
                        </div>
                    </div>
                    <div className="text-out-right">
                        <div className="circle-out-text"
                            onClick={() => {
                                navigate('/data_model/data_pipeline/us_pipeline')
                            }}>
                            <div>StarPipeline</div>
                            <div>数据生产</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="circle-in-text text-in-topleft"
                            // onClick={() => {
                            //     window.open('http://abtest.tmeoa.com/', 'bank')
                            // }}
                            ><span>星盘</span></div>
                            <div className="circle-in-text text-in-topright"
                                onClick={() => {
                                    window.open('http://tagstar.tmeoa.com/', 'bank')
                                }}
                            ><span>星画</span></div>
                            <div className="circle-in-text text-in-bottomleft"
                                onClick={() => {
                                    window.open('http://wj.tencentmusic.com/', 'bank')
                                }}
                            ><span>星研</span></div>
                            <div className="circle-in-text text-in-bottomright"
                                onClick={() => {
                                    window.open('http://abtest.tmeoa.com/', 'bank')
                                }}
                            ><span>实验</span></div>
                        </div>
                        <div>
                            <div className="cicle-text-core cicle-text-left">数据</div>
                            <div className="cicle-text-core cicle-text-right">算法</div>
                        </div>
                    </div>
                    <div className="logo-center ta-c">
                        <img src={require('../../images/loadingStar.svg').default} />
                        {/* <div className="pt16 fs20"><strong>cube数据平台</strong></div> */}
                    </div>

                </div>
            </div>
        </div>
    )
}
