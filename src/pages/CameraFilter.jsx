import { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { NavLink } from "react-router";
import hairdo from "../assets/bob_cutout.png";
import hairdo1 from "../assets/PNGs/AR_Hairstyles_1.png";
import hairdo2 from "../assets/PNGs/AR_Hairstyles_2.png";
import hairdo3 from "../assets/PNGs/AR_Hairstyles_3.png";
import hairdo4 from "../assets/PNGs/AR_Hairstyles_4.png";
import hairdo5 from "../assets/PNGs/AR_Hairstyles_5.png";
import hairdo6 from "../assets/PNGs/AR_Hairstyles_6.png";
import hairdo7 from "../assets/PNGs/AR_Hairstyles_7.png";
import hairdo8 from "../assets/PNGs/AR_Hairstyles_8.png";
import hairdo9 from "../assets/PNGs/AR_Hairstyles_9.png";
import hairdo10 from "../assets/PNGs/AR_Hairstyles_10.png";
const HEIGHT = 434;

export default function CameraFilter() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceRef = useRef(null);
  const hairdoRef = useRef(hairdo1);
  
  const hairdoImages = [hairdo1, hairdo2, hairdo3, hairdo4, hairdo5, hairdo6, hairdo7, hairdo8, hairdo9, hairdo10];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

      faceRef.current = await net.estimateFaces(video);
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

    // draw interval 
    setInterval(() => {
      const ctx = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
        //desynchronized: true,
      }); // HTMLCanvasElement.getContext() creates the 'canvas' to draw on
      requestAnimationFrame(() => {
        //ctx.clearRect(0,0,ctx.width,ctx.height)
        //ctx.imageSmoothingEnabled = true;
        const x = Math.floor(faceRef.current[0].keypoints[10].x);
        const y = Math.floor(faceRef.current[0].keypoints[10].y);
        const z = Math.floor(faceRef.current[0].keypoints[10].z);

        //console.log("x, y z, :", x, y, z);
        console.log(" z :", z);
        //console.log(hairdoRef.current);
        //console.log(hairdo);
        
        const image = new Image();
        image.src = hairdoRef.current;
        //ctx.drawImage(image, (x - 100), (y - 150), 220, 250);
        image.onload = ctx.drawImage(image, x + 60, y + 110, 175 * ((z / 100) - 1), 250 * ((z /100) - 1)); 
          //(xPosition, yPosition (from top left), width, height)
        ctx.restore();
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

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? hairdoImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === hairdoImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div className="camera-page-container">
        <Webcam
          ref={webcamRef}
          style={{
            //position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            zIndex: 7,
            width: 788,
            height: HEIGHT,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 788,
            height: HEIGHT,
          }}
        ></canvas>
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
        <button
          type="button"
          className="menu-go-button cam-go-button"
          onClick={() => {
            return;
          }}
        >
          Share to Screen
        </button>
        <div className="camera-footer">
          <NavLink to="/" className="home-link">
            Home
          </NavLink>
        </div>
      </div>
    </>
  );
}
