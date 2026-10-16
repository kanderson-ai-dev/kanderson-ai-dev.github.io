import { Composition } from "remotion";
import pilot from "../projects/pilot.json";
import { ProjectPromo } from "./ProjectPromo";
import type { PromoProps } from "./types";

const defaultProps = pilot as PromoProps;

export const Root: React.FC = () => (
  <Composition
    id="ProjectPromo"
    component={ProjectPromo}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={300}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      fps: props.fps,
      durationInFrames: Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)
    })}
  />
);
