import "./index.css";
import { Composition } from "remotion";
import { WingedScapulaB3 } from "./scenes/winged_scapula_b3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="winged-scapula-b3"
        component={WingedScapulaB3}
        // 74.4s × 30fps（storyboard 总时长 74.35s，2026-06-05 校准）
        durationInFrames={2232}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
