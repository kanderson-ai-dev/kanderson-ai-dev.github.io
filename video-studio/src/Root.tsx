import { Composition } from "remotion";
import pilot from "../projects/pilot.json";
import { ProjectPromo } from "./ProjectPromo";
import { PromoTeaser } from "./PromoTeaser";
import { Thumbnail } from "./Thumbnail";
import { Styleframes } from "./upgrade/Styleframes";
import { PromoUpgrade } from "./upgrade/PromoUpgrade";
import { PromoUpgradeVertical } from "./upgrade/PromoUpgradeVertical";
import { ThumbUpgrade } from "./upgrade/ThumbUpgrade";
import { OStyleframes } from "./orchestrator/OStyleframes";
import { OAnimatic } from "./orchestrator/OAnimatic";
import { OLoop, OPoster, OVertical } from "./orchestrator/ODerivatives";
import { MStyleframes } from "./mcptoolkit/MStyleframes";
import { Styleframes3 } from "./mcptoolkit3/Styleframes3";
import { MAnimatic } from "./mcptoolkit/MAnimatic";
import type { MAnimaticProps } from "./mcptoolkit/MAnimatic";
import { PromoMcpToolkit } from "./mcptoolkit/PromoMcpToolkit";
import type { PromoMcpToolkitProps } from "./mcptoolkit/PromoMcpToolkit";
import { SliceA, SliceB } from "./mcptoolkit2/Slice";
import { PromoMcpToolkit2 } from "./mcptoolkit2/PromoMcpToolkit2";
import type { Promo2Props } from "./mcptoolkit2/PromoMcpToolkit2";
import { Promo3 } from "./mcptoolkit3/Promo3";
import type { Promo3Props } from "./mcptoolkit3/Promo3";
import { Thumb3 } from "./mcptoolkit3/thumb3";
import { ThumbAgenticApi } from "./agenticapi/thumb";
import { PromoOrchestrator } from "./orchestrator/PromoOrchestrator";
import { Styleframes2 } from "./orchestrator2/Styleframes2";
import { RagStyleframes } from "./ragsystem/Styleframes";
import { RagAnimatic } from "./ragsystem/RagAnimatic";
import type { RagAnimaticProps } from "./ragsystem/RagAnimatic";
import ragfilm from "../projects/agentic-rag-system-film.json";
import { PromoRag } from "./ragsystem/PromoRag";
import type { PromoRagProps } from "./ragsystem/PromoRag";
import { ThumbRag } from "./ragsystem/thumb";
import { OrchestratorUpgrade } from "./orchestrator2/OrchestratorUpgrade";
import type { O2Props } from "./orchestrator2/OrchestratorUpgrade";
import { ThumbOrch2 } from "./orchestrator2/thumb";
import { AStyleframes } from "./agenticapi/AStyleframes";
import { PromoAgentic } from "./agenticapi/PromoAgentic";
import type { PromoAgenticProps } from "./agenticapi/PromoAgentic";
import type { OrchestratorProps } from "./orchestrator/PromoOrchestrator";
import type { OAnimaticProps } from "./orchestrator/OAnimatic";
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
      id="OrchestratorStyleframes"
      component={OStyleframes}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "hook" } as { design: import("./orchestrator/OStyleframes").OStyleframeDesign }}
    />
    <Composition
      id="McpToolkitStyleframes"
      component={MStyleframes}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "cold" } as { design: import("./mcptoolkit/MStyleframes").MStyleframeDesign }}
    />
    <Composition
      id="McpToolkit3Styleframes"
      component={Styleframes3}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "hook" } as { design: import("./mcptoolkit3/Styleframes3").Styleframe3Design }}
    />
    <Composition
      id="McpToolkitAnimatic"
      component={MAnimatic}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.4, variant: "A" } as MAnimaticProps}
      calculateMetadata={({ props }: { props: MAnimaticProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="PromoMcpToolkit"
      component={PromoMcpToolkit}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.4 } as PromoMcpToolkitProps}
      calculateMetadata={({ props }: { props: PromoMcpToolkitProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="PromoMcpToolkit2"
      component={PromoMcpToolkit2}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], fadeOutSec: 1.4 } as Promo2Props}
      calculateMetadata={({ props }: { props: Promo2Props }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="PromoMcpToolkit3"
      component={Promo3}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.2 } as Promo3Props}
      calculateMetadata={({ props }: { props: Promo3Props }) => ({
        fps: 60,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * 60)),
      })}
    />
    <Composition
      id="ThumbMcpToolkit3"
      component={Thumb3}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ variant: "keys" } as { variant?: string }}
    />
    <Composition
      id="ThumbAgenticApi"
      component={ThumbAgenticApi}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ variant: "brand" } as { variant?: string }}
    />
    <Composition
      id="McpToolkitSliceB"
      component={SliceB}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={1315}
      defaultProps={{ subtitles: [] as import("./mcptoolkit2/Captions2").CapCue[] }}
    />
    <Composition
      id="McpToolkitSliceA"
      component={SliceA}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={1315}
      defaultProps={{ subtitles: [] as import("./mcptoolkit2/Captions2").CapCue[] }}
    />
    <Composition
      id="OrchestratorAnimatic"
      component={OAnimatic}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.2 } as OAnimaticProps}
      calculateMetadata={({ props }: { props: OAnimaticProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="PromoOrchestrator"
      component={PromoOrchestrator}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.4 } as OrchestratorProps}
      calculateMetadata={({ props }: { props: OrchestratorProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="OrchestratorLoop"
      component={OLoop}
      width={1280}
      height={582}
      fps={60}
      durationInFrames={360}
    />
    <Composition
      id="OrchestratorPoster"
      component={OPoster}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
    />
    <Composition
      id="OrchestratorVertical"
      component={OVertical}
      width={1080}
      height={1920}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [] } as OrchestratorProps}
      calculateMetadata={({ props }: { props: OrchestratorProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="Orchestrator2Upgrade"
      component={OrchestratorUpgrade}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ fps: 60, scenes: [], subtitles: [], burnSubtitles: true, fadeInSec: 0.4, fadeOutSec: 1.4 } as O2Props}
      calculateMetadata={({ props }: { props: O2Props }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(
          props.scenes.reduce((a, s) => Math.max(a, s.startSec + s.durationSec), 0) * props.fps)),
      })}
    />
    <Composition
      id="ThumbOrchestrator2"
      component={ThumbOrch2}
      width={1280}
      height={720}
      fps={60}
      durationInFrames={60}
      defaultProps={{ variant: "debate" } as { variant?: string }}
    />
    <Composition
      id="Orchestrator2Styleframes"
      component={Styleframes2}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "coldopen" } as { design: import("./orchestrator2/Styleframes2").Orchestrator2Design }}
    />
    <Composition
      id="RagStyleframes"
      component={RagStyleframes}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "coldopen" } as { design: import("./ragsystem/Styleframes").RagDesign }}
    />
    <Composition
      id="RagAnimatic"
      component={RagAnimatic}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={ragfilm as RagAnimaticProps}
      calculateMetadata={({ props }: { props: RagAnimaticProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="PromoRag"
      component={PromoRag}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={ragfilm as unknown as PromoRagProps}
      calculateMetadata={({ props }: { props: PromoRagProps }) => ({
        fps: props.fps,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * props.fps)),
      })}
    />
    <Composition
      id="AgenticApiStyleframes"
      component={AStyleframes}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={60}
      defaultProps={{ design: "coldopen" } as { design: import("./agenticapi/AStyleframes").AgenticApiDesign }}
    />
    <Composition
      id="PromoAgenticApi"
      component={PromoAgentic}
      width={1920}
      height={1080}
      fps={60}
      durationInFrames={600}
      defaultProps={{ scenes: [], subtitles: [], burnSubtitles: true, fadeOutSec: 1.2 } as PromoAgenticProps}
      calculateMetadata={({ props }: { props: PromoAgenticProps }) => ({
        fps: 60,
        durationInFrames: Math.max(60, Math.round(props.scenes.reduce((a, s) => a + s.durationSec, 0) * 60)),
      })}
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
    <Composition
      id="RagThumbnail"
      component={ThumbRag}
      width={1280}
      height={720}
      fps={30}
      durationInFrames={30}
      defaultProps={{ variant: "proof" } as { variant?: string }}
    />
  </>
);
