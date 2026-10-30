import { Composition } from "remotion";
import pilot from "../projects/pilot.json";
import { ProjectPromo } from "./ProjectPromo";
import { PromoTeaser } from "./PromoTeaser";
import { Thumbnail } from "./Thumbnail";
import { Styleframes } from "./upgrade/Styleframes";
import { PromoUpgrade } from "./upgrade/PromoUpgrade";
import { PromoUpgradeVertical } from "./upgrade/PromoUpgradeVertical";
import { ThumbUpgrade } from "./upgrade/ThumbUpgrade";
import type { UpgradeProps } from "./upgrade/PromoUpgrade";
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
      id="PromoUpgrade"
      component={PromoUpgrade}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.2 } as UpgradeProps}
      calculateMetadata={({ props }: { props: UpgradeProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="PromoUpgradeVertical"
      component={PromoUpgradeVertical}
      width={1080}
      height={1920}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.2 } as UpgradeProps}
      calculateMetadata={({ props }: { props: UpgradeProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="UpgradeStyleframes"
      component={Styleframes}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "hook" } as { design: import("./upgrade/Styleframes").StyleframeDesign }}
    />
    <Composition
      id="UpgradeThumbnail"
      component={ThumbUpgrade}
      width={1280}
      height={720}
      fps={60}
      durationInFrames={60}
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
