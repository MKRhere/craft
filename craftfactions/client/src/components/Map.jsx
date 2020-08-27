import React, { useRef, useEffect } from "react";
import { css } from "emotion";
import { useState } from 'react';

const iframecss = css`
width : 100%;
height :100%;
`;

const input = css`

`;

function Map(props){
    const container = useRef(null);
    const [inputx, setInputx] = useState("");
    const [inputy, setInputy] = useState("");
    const [inputz, setInputz] = useState("");

    const x = inputx;
    const y = inputy;
    const z = inputz;

	useEffect(() => {
		if (container.current) {
             
			container.current.contentWindow.location.reload();
		}
	}, [container.current]);

    return (
    <div>
    <iframe frameBorder="0" className={iframecss} ref={container}
                src={`https://map.craft.mkr.pw/#overworld/0/0/${x}/${z}/${y}`}>
            </iframe>
            <input {...props} value={inputx} className={input} type='text' 
            onChange={e => setInputx(e.target.value)} />
            <input {...props} value={inputy} className={input} type='text' 
            onChange={e => setInputy(e.target.value)} />
            <input {...props} value={inputz} className={input} type='text' 
            onChange={e => setInputz(e.target.value)} />
            </div>
    );
}

export default Map;