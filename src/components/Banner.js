import * as React from "react";
import useWindowSize from "@rooks/use-window-size";
import logo from '../assets/logo.png';
import ParticleImage, {
  ParticleOptions,
  Vector,
  forces,
  ParticleForce
} from "react-particle-image";

const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    // Get pixel
    const pixel = image.get(x, y);
    //console.log(pixel);
    // Make a particle for this pixel if blue > 50 (range 0-255)
    return pixel.b < 50;
  },
  color: ({ x, y, image }) => "#0a8f0b",
  radius: () => Math.random() * 1.5 + 0.5,
  mass: () => 50,
  friction: () => 0.30,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width * 0.7, canvasDimensions.height / 2);
  }
};

const motionForce = (x: number, y: number): ParticleForce => {
  return forces.disturbance(x, y, 5);
};

export default function Banner() {
  const { innerWidth, innerHeight } = useWindowSize();

  return (
    <>
    <ParticleImage
      src={logo}
      width={Number(innerWidth)}
      height={Number(innerHeight)}
      scale={1.5}
      entropy={20}
      maxParticles={8000}
      particleOptions={particleOptions}
      mouseMoveForce={motionForce}
      touchMoveForce={motionForce}
      backgroundColor="#191D1F"
    />
    </>
  );
}