// TODO: screenshot capability
//  imagemagick from script, ran on server, saved to assets/screenshots
// TODO: posting them to home page carousel
// TODO: refine each image position
// TODO: refresh button

import * as tf from "@tensorflow/tfjs"; /* Appears as not read but is VERY IMPORTANT */
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { NavLink } from "react-router";

const HEIGHT = 480;
const WIDTH = 640;

// Dynamically import all hairdo images using Vite's import.meta.glob()
const hairdoModules = import.meta.glob("../assets/PNGs/AR_Hairstyles_*.png", {
  eager: true,
});

// Convert to sorted array by extracting number from filename
const hairdoImages = Object.keys(hairdoModules)
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  })
  .map((key) => hairdoModules[key].default || hairdoModules[key]);

export default function CameraFilter() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceRef = useRef(null);
  const hairdoRef = useRef(hairdoImages[0]);
  const rotationZRef = useRef(0); // z-axis rotation in radians (roll)
  const rotationXRef = useRef(0); // x-axis rotation in radians (pitch)
  const rotationYRef = useRef(0); // y-axis rotation in radians (yaw)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rotationZ, setRotationZ] = useState(0); // z-axis rotation in degrees
  const [rotationX, setRotationX] = useState(0); // x-axis rotation in degrees
  const [rotationY, setRotationY] = useState(0); // y-axis rotation in degrees

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      try {
        faceRef.current = await net.estimateFaces(video);
      } catch (err) {
        console.log("fetch error: ", err);
        ``;
      }
    }
  };

  const runFacemesh = async () => {
    const net = await facemesh.createDetector(
      facemesh.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "tfjs",
        maxFaces: 1,
        refineLandmarks: false,
      },
    );

    const ctx = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
      desynchronized: true,
      perserveDrawingBuffer: true,
    });

    // draw interval
    setInterval(() => {
      // HTMLCanvasElement.getContext() creates the 'canvas' to draw on
      requestAnimationFrame(() => {
        //console.log(faceRef.current)
        if (faceRef.current.length != 0) {
          //const topX = Math.floor(faceRef.current[0].keypoints[10].x);
          const topY = Math.floor(faceRef.current[0].keypoints[10].y);
          const topZ = Math.floor(faceRef.current[0].keypoints[10].z);

          const leftX = Math.floor(faceRef.current[0].keypoints[234].x);
          const leftY = Math.floor(faceRef.current[0].keypoints[234].y);
          const leftZ = Math.floor(faceRef.current[0].keypoints[234].z);

          const rightX = Math.floor(faceRef.current[0].keypoints[454].x);
          const rightY = Math.floor(faceRef.current[0].keypoints[454].y);
          const rightZ = Math.floor(faceRef.current[0].keypoints[454].z);

          //const bottomX = Math.floor(faceRef.current[0].keypoints[152].x);
          const bottomY = Math.floor(faceRef.current[0].keypoints[152].y);
          const bottomZ = Math.floor(faceRef.current[0].keypoints[152].z);

          const pitchDegrees =
            Math.atan2(bottomZ - topZ, bottomY - topY) * (180 / Math.PI);
          const yawDegrees =
            Math.atan2(leftZ - rightZ, rightX - leftX) * (180 / Math.PI);
          const rollDegrees =
            Math.atan2(rightY - leftY, rightX - leftX) * (180 / Math.PI);

          //console.log("degrees, ", rollDegrees, pitchDegrees, yawDegrees)

          const faceWidth = Math.floor(faceRef.current[0].box.width);
          const faceHeight = Math.floor(faceRef.current[0].box.height);
          const x = Math.floor(faceRef.current[0].box.xMin);
          const y = Math.floor(faceRef.current[0].box.yMin);

          // radions
          // X-axis rotation handlers (pitch - tilt forward/backward)
          setRotationX((prev) => Math.min(pitchDegrees)); // Limit to prevent flipping
          //setRotationX((prev) => Math.max(prev - 15, -89)); // Limit to prevent flipping

          // Y-axis rotation handlers (yaw - turn left/right)
          setRotationY((prev) => Math.max(yawDegrees)); // Limit to prevent flipping

          setRotationZ((prev) => rollDegrees);

          // drawing image
          const image = new Image();
          image.src = hairdoRef.current;

          // Calculate center point for rotation
          const centerX = x + faceWidth / 2;
          const centerY = y + faceHeight / 2;

          //console.log("refs, ", rotationXRef.current, rotationYRef.current, rotationZRef.current)

          // Calculate scaling factors for X and Y axis rotations (perspective effect)
          const scaleX = Math.cos(rotationYRef.current); // Y-axis rotation affects horizontal scale
          const scaleY = Math.cos(rotationXRef.current); // X-axis rotation affects vertical scale

          // Apply all rotation transformations
          ctx.save();
          ctx.translate(centerX, centerY);
          //ctx.translate(centerX, centerY);
          // Apply Z-axis rotation (roll)
          ctx.rotate(rotationZRef.current);

          // Apply X and Y axis rotations through scaling (simulating 3D perspective)
          ctx.scale(scaleX, scaleY);

          ctx.drawImage(
            image,
            -faceWidth / 1.55, // position of image origin point (0,0)
            -faceHeight,
            faceWidth * 1.32, // actual width, from sideburn to sideburn
            faceHeight,
          );

          ctx.restore();
        }
      });
    }, 1000 / 60);

    // detect interval
    setInterval(() => {
      detect(net);
    }, 1000 / 60);
  };

  useEffect(() => {
    runFacemesh();
  }, []);

  useEffect(() => {
    hairdoRef.current = hairdoImages[currentImageIndex];
  }, [currentImageIndex]);

  useEffect(() => {
    // Convert degrees to radians and update refs
    rotationZRef.current = (rotationZ * Math.PI) / 180;
  }, [rotationZ]);

  useEffect(() => {
    rotationXRef.current = (rotationX * Math.PI) / 180;
  }, [rotationX]);

  useEffect(() => {
    rotationYRef.current = (rotationY * Math.PI) / 180;
  }, [rotationY]);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? hairdoImages.length - 1 : prevIndex - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === hairdoImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <>
      <div className="camera-page-container">
        <div className="booger">
          {" "}
          <Webcam
            ref={webcamRef}
            style={{
              //position: "absolute",
              left: 0,
              right: 0,
              zIndex: 7,
              width: WIDTH,
              height: HEIGHT,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              //margin: "0 auto",
              top: 0,
              left: 0,
              zIndex: 9,
              width: WIDTH,
              height: HEIGHT,
            }}
          ></canvas>
        </div>

        <h2 className="home-title">Select Your Style</h2>
        <div className="product-image-container">
          <button
            type="button"
            className="carousel-button carousel-button-left"
            onClick={handlePreviousImage}
            aria-label="Previous image"
          >
            ‹
          </button>
          <img
            src={hairdoImages[currentImageIndex]}
            alt={`Hairdo ${currentImageIndex + 1}`}
            className="product-image"
          />
          <button
            type="button"
            className="carousel-button carousel-button-right"
            onClick={handleNextImage}
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        <div className="camera-footer">
          <NavLink to="/" className="home-link">
            Home
          </NavLink>
        </div>
      </div>
    </>
  );
}
