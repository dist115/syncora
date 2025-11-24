'use client';

import { SyntheticEvent, useRef, useState } from 'react';
import {
  RiFullscreenFill,
  RiPauseFill,
  RiPlayMiniFill,
  RiTriangleFill,
} from 'react-icons/ri';
import { ActionIcon, Text } from 'rizzui';

import { cn } from '@/lib/utils/cn';
import { Pause } from '@/components/atoms/icons/pause';
import { Play } from '@/components/atoms/icons/play';
import { Box } from '@/components/atoms/layout';
import RangeSlider from '@/components/atoms/range-slider';

const rangeSliderClassName =
  '[&_.rc-slider-track]:bg-[#40C17B] [&_.rc-slider-rail]:bg-[#111111] [&_.rc-slider-handle]:!border-[#8092A2] [&_.rc-slider-handle]:bg-[#0B2F4F] [&_.rc-slider-handle]:duration-300 [&_.rc-slider-handle]:border-[2px] [&_.rc-slider-handle]:hover:!border-white/80 [&_.rc-slider-handle]:transition-colors';

export function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [percentage, setPercentage] = useState<number>(0);

  function handleTimeUpdate(e: SyntheticEvent<HTMLVideoElement, Event>) {
    const currentTime = e.currentTarget.currentTime;
    setPercentage((currentTime * 100) / duration);
  }

  function handleFullScreen() {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  }

  function handleOnPlay(e: SyntheticEvent<HTMLVideoElement, Event>) {
    setPlayed(true);
    setPlaying(true);
    setDuration(e.currentTarget.duration);
  }

  function handleBeforeChange(v: number) {
    if (playing) {
      videoRef.current?.pause();
    }
  }
  function handleAfterChange(v: number) {
    if (playing) {
      videoRef.current?.play();
    }
  }

  function handleChangeVideTimeline(value: number) {
    if (played) {
      const currentTime = (duration / 100) * value;
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
      }
      setPercentage((currentTime * 100) / duration);
    }
  }

  function handleVolume(value: number) {
    setVolume(value / 100);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
    }
  }

  function handlePlayPause() {
    if (playing) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
    }
  }

  return (
    <Box className="aspect-video md:w-1/2 md:mt-0 md:mb-0 relative max-w-[800px] mt-11 -mb-32 bg-[red]/0 rounded-3xl p-1.5">
      <Box className="w-full h-full group bg-black rounded-[20px] relative overflow-hidden">
        <video
          ref={videoRef}
          poster="/assets/intro-poster.webp"
          className="w-full h-full object-cover rounded-[20px]"
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handleOnPlay}
          onVolumeChange={() => {
            if (videoRef.current) {
              setVolume(videoRef.current.volume);
            }
          }}
        >
          <source src="/assets/intro-2.mp4" type="video/mp4" />
          <p> Your browser does not support the video tag.</p>
        </video>
        <Box
          className={cn(
            'absolute -bottom-0 duration-500 left-0 right-0 w-full bg-[#1F2937] text-white px-6 pt-4 pb-5 ',
            played && 'group-hover:bottom-0'
          )}
        >
          <Box className="flex gap-10 mb-3 justify-between">
            <Box className="w-4/5 ps-0.5">
              <RangeSlider
                value={percentage}
                step={0.01}
                // @ts-ignore
                onChange={handleChangeVideTimeline}
                // @ts-ignore
                onAfterChange={handleAfterChange}
                // @ts-ignore
                onBeforeChange={handleBeforeChange}
                className={rangeSliderClassName}
              />
            </Box>
            <Box className="w-1/5">
              <RangeSlider
                step={0.01}
                value={volume * 100}
                // @ts-ignore
                onChange={handleVolume}
                className={rangeSliderClassName}
              />
            </Box>
          </Box>
          <Box className="flex items-center gap-5">
            <ActionIcon
              aria-label="Video Play Button"
              onClick={handlePlayPause}
              className="outline-none w-auto h-auto bg-transparent hover:bg-transparent p-0"
            >
              {playing ? (
                <Pause className="w-6 h-auto -ms-0.5 me-0.5" />
              ) : (
                <Play className="w-6 h-auto" />
              )}
            </ActionIcon>
            <Text as="span" className="select-none font-medium">
              {formatVideoTimeline((duration / 100) * percentage)} /{' '}
              {formatVideoTimeline(duration)}
            </Text>
            <ActionIcon
              aria-label="Video Fullscreen Button"
              className="ml-auto p-0 w-auto h-auto hover:bg-transparent bg-transparent border-0 outline-none"
              onClick={handleFullScreen}
            >
              <RiFullscreenFill className="w-5 h-auto" />
            </ActionIcon>
          </Box>
        </Box>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-[54px] lg:h-[54px]">
          <ActionIcon
            onClick={handlePlayPause}
            aria-label="Video Play Button"
            className={cn(
              'bg-white w-full h-full shadow-lg group/actionIcon rounded-full border-2 flex items-center justify-center border-[#0B2F4F] duration-500 hover:bg-[#0B2F4F]',
              playing && 'opacity-0 invisible'
            )}
          >
            <RiTriangleFill className="lg:w-3.5 w-2.5 rotate-90 -mr-1 duration-200 group-hover/actionIcon:text-white h-auto text-[#0B2F4F]" />
          </ActionIcon>
        </Box>
      </Box>
    </Box>
  );
}

function formatVideoTimeline(seconds: number) {
  let hours: number | string = Math.floor(seconds / 3600);
  let minutes: number | string = Math.floor((seconds % 3600) / 60);
  let remainingSeconds: number | string = Math.floor(seconds % 60);

  // Add leading zeros if necessary
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes === 0 ? '00' : minutes < 10 ? '0' + minutes : minutes;
  remainingSeconds =
    remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

  return minutes + ':' + remainingSeconds;
}
