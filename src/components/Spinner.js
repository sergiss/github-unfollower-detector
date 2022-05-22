import React from 'react'

import loading from '../spinner.gif';

const getStyle = ()=> {
    return {
        position: "absolute",
        width: '100%',
        height: '100%',
        top:'0',
        left:'0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#88888888',
    }
}

function Spinner() {
    return (
        <div style={getStyle()}>
            <img src={loading} alt="loading" width='200px' height='200px'></img>
        </div>
    )
}

export default Spinner