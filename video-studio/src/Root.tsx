import { Composition } from "remotion";
import pilot from "../projects/pilot.json";
import { ProjectPromo } from "./ProjectPromo";
import { PromoTeaser } from "./PromoTeaser";
import { Thumbnail } from "./Thumbnail";
import type { PromoProps } from "./types";

const defaultProps = pilot as PromoProps;

const meta = ({ props }: { props: PromoProps }) => ({
  fps: props.fps,
  durationInFrames: Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)
});

export const Root: React.FC = () => (
  <>
    <Composition
      id="ProjectPromo"
      component={ProjectPromo}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={300}
      defaultProps={defaultProps}
      calculateMetadata={meta}
    />
    <Composition
      id="ProjectPromoTeaser"
      component={PromoTeaser}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={300}
      defaultProps={defaultProps}
      calculateMetadata={meta}
    />
    <Composition
      id="PromoThumbnail"
      component={Thumbnail}
      width={1280}
      height={720}
      fps={30}
      durationInFrames={30}
      defaultProps={defaultProps}
    />
  </>
);
