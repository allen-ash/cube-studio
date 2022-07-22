import React, { useState } from 'react'
import DataDiscoverySearch from '../../components/DataDiscoverySearch/DataDiscoverySearch';
import './DataDiscovery.less';

export default function DataDiscovery() {
    const [searchContent, setSearchContent] = useState<string>()

    return (
        // <div className="wrap">
        //     <div className="shadowTop"></div>
        //     <div className="shadowBottom"></div>
        // </div>
        // <div className="g-container">
        //     <div className="g-triangle"></div>
        // </div>
        <div className="d-f jc ac h100 w100">
            <DataDiscoverySearch
                value={searchContent}
                // isOpenSearchMatch
                onChange={(value) => {
                    setSearchContent(value)
                }}
                // options={['123', 'asdf']}
                placeholder="输入关键字（表名）搜索" />
        </div>
    )
}
