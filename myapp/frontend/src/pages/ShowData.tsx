import React, { useEffect, useState } from 'react'
import { showCustomData } from '../api/swallowApi'
import { getParam } from '../util'

export default function ShowData() {
    const [data, setData] = useState<string>('')
    useEffect(() => {
        const type = getParam('type') || ''
        const code = getParam('code') || ''
        const args = getParam('args') || ''
        showCustomData({
            type,
            code,
            args
        }).then(res => {
            console.log(res);
            setData(res.data)
        })
    }, [])
    return (
        <div className="fade-in" dangerouslySetInnerHTML={{ __html: data }}>

        </div>
    )
}
