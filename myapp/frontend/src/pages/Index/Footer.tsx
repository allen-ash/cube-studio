import React from 'react'

export default function Footer() {
  return (
    <div className="bg-b p-r z9">
      <img className="dec-partnar" src={require('../../images/index/partnar-shape-2.png')} alt="" />
      <div className="d-f jc home-wrapper">
        <div className="home-wrapper-container pb48 pt64 c-text-w">
          <div className="fs18 pb16">联系我们</div>
          <div className="d-f">
            <div className="mr64">
              <div className="pb16">
                <div className="pb16">
                  <span>星云：</span>
                  <a href="wxwork://message?username=zeluswu" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />zeluswu</a>
                  <a href="wxwork://message?username=pengluan" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />pengluan</a>
                </div>
                <span>星画：</span>
                <a href="wxwork://message?username=yizihuang" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />yizihuang</a>
                <span>ABT：</span>
                <a href="wxwork://message?username=marklaw" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />marklaw</a>
              </div>
              <div className="pb16">
                <span>星研：</span>
                <a href="wxwork://message?username=hikichen" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />hikichen</a>
              </div>
              <div className="pb16">
                <span>机器学习：</span>
                <a href="wxwork://message?username=pengluan" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />pengluan</a>
                <a href="wxwork://message?username=kalenchen" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />uthermai</a>
              </div>
            </div>
            <div className="mr64">
              <div className="pb16">
                <span>星盘-Superset：</span>
                <a href="wxwork://message?username=flytengzeng" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />flytengzeng</a>
                <a href="wxwork://message?username=samcchen" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />samcchen</a>
              </div>
              <div className="pb16">
                <span>IDMapping：</span>
                <a href="wxwork://message?username=austinlu" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />austinlu</a>
                <a href="wxwork://message?username=tommymftang" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />tommymftang</a>
              </div>
              <div className="pb16">
                <span>元数据管理：</span>
                <a href="wxwork://message?username=yannsu" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />yannsu</a>
                <a href="wxwork://message?username=devili" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />devili</a>
              </div>
              {/* <div className="pb16">
                <span>Datatalk：</span>
              </div> */}
              <div className="pb16">
                <span>数据安全管理：</span>
                <a href="wxwork://message?username=xuxuqin" target="_blank" className="pr8 c-text-w"><img style={{ width: 16 }} className="mr8" src={require('../../images/rtxIcon.png')} alt="" />xuxuqin</a>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="divider"></div>
      <div className="ta-c ptb32 c-text-w">©2022 by TME 业务数据智能中心 All Rights Reserved</div>
    </div>
  )
}
