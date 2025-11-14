// assets/src/components/shorts/ShortItem.js
import { useRef } from "react";
import YoutubePlayer from "@dooboo/react-native-youtube-iframe";

export function getYoutubeId(url) {
  const reg = /(?:shorts\/|v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default function ShortItem({ url, visible, layout }) {
  const id = getYoutubeId(url);
  const ref = useRef(null);

  return (
    <YoutubePlayer
      ref={ref}
      height={layout.height}
      width={layout.width}
      videoId={id}
      play={visible}
      onChangeState={(state) => {
        if (state === "ended" && visible) {
          ref.current?.seekTo(0, true);
        }
      }}
      webViewProps={{
        allowsFullscreenVideo: false,
        injectedJavaScript: `
            document.body.style.backgroundColor = "black";
            true;
        `,
      }}
    />
  );
}
