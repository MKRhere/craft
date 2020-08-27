import React, { useRef, useEffect } from "react";


function Map(props){
    const container = useRef(null);
    const x = props.x;
    const y = props.y;
    const z = props.z;

	useEffect(() => {
		if (container.current) {
             
			container.current.contentWindow.location.reload();
		}
	}, [container.current]);

    return (
    
    <iframe frameBorder="0" style={{ width: "100%", height: "100%"}} ref={container}
                src={`https://map.craft.mkr.pw/#overworld/0/0/${x}/${z}/${y}`}>
            </iframe>
    );
}

export default Map;