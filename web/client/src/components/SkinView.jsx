import React, { useRef, useEffect } from "react";
import { SkinViewer, WalkingAnimation } from "skinview3d";

function SkinView({
	width = 300,
	height = 400,
	skin,
	cape = null,
	model = "auto-detect",
}) {
	const container = useRef(null);

	useEffect(() => {
		if (container.current) {
			const skinViewer = new SkinViewer(container.current, {
				width,
				height,
				skin,
				cape,
			});

			skinViewer.loadSkin(skin, model);

			// Add an animation
			skinViewer.animations.add(WalkingAnimation);
			skinViewer.playerObject.rotation.y = 0.5;
			skinViewer.playerObject.rotation.x = 0.4;
		}
	}, [container.current]);

	return <div ref={container}></div>;
}

export default SkinView;
