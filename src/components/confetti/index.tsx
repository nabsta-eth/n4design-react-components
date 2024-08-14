import * as React from "react";
import range from "lodash/range";
import { createPortal } from "react-dom";
import useStyles, { IParticle } from "./styles";

// Default vertical force at which particles initially explode : 0-1.
const FORCE = 0.5;
// Max height for particle rectangles or diameter for particle circles.
const SIZE = 12;
// Distance particles will fall from initial explosion point - CSS value.
const HEIGHT = "120vh";
// Default horizontal spread of particles in pixels.
const WIDTH = 1000;
// Default number of particles.
const PARTICLE_COUNT = 100;
// Default duration of particle explosion in ms.
const DURATION = 2200;
// Default number of iterations..
const REPEATS = 1;

export interface ConfettiProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "ref"> {
  particleCount?: number;
  duration?: number;
  colors?: string[];
  images?: string[];
  particleSize?: number;
  force?: number;
  height?: number | string;
  width?: number;
  zIndex?: number;
  repeats?: number;
  onComplete?: () => void;
}

const createParticles = (count: number, colors: string[]): IParticle[] => {
  const increment = 360 / count;
  return range(count).map(index => ({
    color: colors[index % colors.length],
    image: "",
    degree: increment * index,
  }));
};

const createImageParticles = (count: number, images: string[]): IParticle[] => {
  const increment = 360 / count;
  return range(count).map(index => ({
    image: images[index % images.length],
    color: "",
    degree: increment * index,
  }));
};

export const ConfettiExplosion = ({
  particleCount = PARTICLE_COUNT,
  duration = DURATION,
  colors = [],
  images = [],
  particleSize = SIZE,
  force = FORCE,
  height = HEIGHT,
  width = WIDTH,
  zIndex,
  repeats = REPEATS,
  onComplete,
  ...props
}: ConfettiProps) => {
  const [origin, setOrigin] = React.useState<{ top: number; left: number }>();
  const particles = createParticles(particleCount, colors);
  const imageParticles = createImageParticles(particleCount, images);
  const classes = useStyles({
    particles: images.length ? imageParticles : particles,
    duration,
    repeats,
    particleSize,
    force,
    width,
    height,
  });

  const originRef = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      const { top, left } = node.getBoundingClientRect();
      setOrigin({ top, left });
    }
  }, []);

  React.useEffect(() => {
    if (typeof onComplete === "function") {
      const timeout = setTimeout(onComplete, duration);
      return () => clearTimeout(timeout);
    }
  }, [duration, onComplete]);

  return (
    <div ref={originRef} className={classes.container} {...props}>
      {origin &&
        createPortal(
          <div
            className={classes.screen}
            {...(zIndex ? { style: { zIndex } } : null)}
          >
            <div
              style={{
                position: "absolute",
                top: origin.top,
                left: origin.left,
              }}
            >
              {particles.map((particle, i) => (
                <div
                  id={`confetti-particle-${i}`}
                  className={classes.particle}
                  key={particle.degree}
                >
                  <div></div>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
