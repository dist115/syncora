'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { RiTriangleFill } from 'react-icons/ri';
import VideoPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { ActionIcon } from 'rizzui';
import screenfull from 'screenfull';

import { cn } from '@/lib/utils/cn';
import { GradientBorder } from '@/components/atoms/gradient-border';
import { Box } from '@/components/atoms/layout';

import { VideoPlayerControl } from './video-player-control';

type IntroVideoProps = {
  videoUrl: string;
};

export function IntroVideo({ videoUrl }: IntroVideoProps) {
  const videoPlayerRef = useRef(null);
  const videoPlayerWrapperRef = useRef(null);
  const [thumbnailVisibility, setThumbnailVisibility] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [videoSliderProgress, setVideoSliderProgress] = useState<number>(0);
  const [seeking, setSeeking] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const playPauseHandler = () => {
    setPlaying((prev) => !prev);
  };

  function volumeChangeHandler(value: number) {
    setVolume(value / 100);
  }

  function handleMuteUnmute() {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.5);
    }
  }

  const handleVideoProgressChange = useCallback((value: number) => {
    setVideoSliderProgress(value);
  }, []);

  const handleVideoProgressAfterChange = useCallback((value: number) => {
    setVideoSliderProgress(value);
    setSeeking(true);

    // @ts-ignore
    videoPlayerRef.current.seekTo(value / 100);
  }, []);

  function handleOnProgress(props: OnProgressProps) {
    if (!seeking) {
      setVideoSliderProgress(() => (props.playedSeconds / videoDuration) * 100);
    }
  }

  const handleFullScreen = useCallback(() => {
    screenfull.toggle(videoPlayerWrapperRef.current!);
    screenfull.on('change', () => {
      setIsFullscreen(screenfull.isFullscreen);
    });
  }, []);

  const handleOnEnded = useCallback(() => {
    setPlaying(false);
    setThumbnailVisibility(true);
  }, []);

  return (
    <Box className="w-full relative [@media(min-width:375px)]:w-[327px] [@media(min-width:500px)]:w-[400px] sm:w-[500px] md:!w-1/2 2xl:!w-[720px] 3xl:!w-[800px] md:mt-0 md:mb-0 mt-11 -mb-32 lg:p-4">
      <Box className="w-full h-full absolute inset-0 overflow-hidden ">
        <GradientBorder
          radius={28}
          gradient="linear-gradient(169deg, #228B99 3.25%, rgba(31, 147, 125, 0.00) 33.08%, rgba(29, 155, 99, 0.00) 61.48%, #19A540 97.93%)"
          className="w-full h-full"
        />
      </Box>
      <Box className="w-[calc(100%_-_16px)] h-[calc(100%_-_16px)] absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden ">
        <GradientBorder
          radius={24}
          gradient="linear-gradient(169deg, #228B99 3.25%, rgba(31, 147, 125, 0.00) 33.08%, rgba(29, 155, 99, 0.00) 61.48%, #19A540 97.93%)"
          className="w-full h-full"
        />
      </Box>
      <Box
        ref={videoPlayerWrapperRef}
        className="w-full flex rounded-[19px] lg:overflow-hidden z-10 group flex-col relative"
      >
        <Box
          className={cn(
            'w-full aspect-video rounded-t-xl lg:rounded-[19px] group bg-black relative overflow-hidden',
            isFullscreen &&
              'rounded-none h-full flex items-center justify-center'
          )}
        >
          <VideoPlayer
            ref={videoPlayerRef}
            className="object-contain w-full h-full"
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            onProgress={handleOnProgress}
            onDuration={(d) => setVideoDuration(d)}
            onBufferEnd={() => setSeeking(false)}
            onEnded={handleOnEnded}
            onStart={() => setThumbnailVisibility(false)}
            onPlay={() => setThumbnailVisibility(false)}
          />
          <Box
            className={cn(
              'absolute w-full h-full visible left-0 top-0 duration-300 opacity-100',
              !thumbnailVisibility && 'opacity-0 invisible',
              isFullscreen && 'opacity-0 invisible'
            )}
          >
            <Image
              src="/assets/intro-thumbnail.webp"
              alt="intro video thumbnail"
              width={800}
              height={450}
              className="w-full h-full object-cover"
              loading='eager'
              priority
            />
          </Box>
          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-[54px] lg:h-[54px]">
            <ActionIcon
              onClick={playPauseHandler}
              aria-label="Video Play Button"
              className={cn(
                'bg-white w-full h-full shadow-lg group/actionIcon rounded-full border-2 flex items-center justify-center border-[#0B2F4F] duration-200 hover:bg-[#0B2F4F]',
                playing && 'opacity-0 invisible'
              )}
            >
              <RiTriangleFill className="lg:w-3.5 w-2.5 sm:w-3 rotate-90 -mr-[3px] duration-200 group-hover/actionIcon:text-white h-auto text-[#0B2F4F]" />
            </ActionIcon>
          </Box>
        </Box>
        {isFullscreen && (
          <span className="absolute peer z-10 bottom-0 left-0 w-full h-[100px]" />
        )}
        <Box
          className={cn(
            'rounded-b-xl lg:rounded-b-[19px] lg:absolute z-20 -bottom-full duration-500 left-0 right-0 w-full bg-[#1F2937] text-white sm:px-5 px-3 2xl:px-6 pt-2.5 2xl:pt-4 pb-2.5 sm:pb-3.5 2xl:pb-5 hover:bottom-0',
            isFullscreen
              ? 'peer-hover:bottom-0 rounded-b-none'
              : 'group-hover:bottom-0'
          )}
        >
          <VideoPlayerControl
            videoSliderProgress={videoSliderProgress}
            playing={playing}
            handleVideoProgressChange={handleVideoProgressChange}
            handleVideoProgressAfterChange={handleVideoProgressAfterChange}
            playPauseHandler={playPauseHandler}
            handleMuteUnmute={handleMuteUnmute}
            volume={volume}
            volumeChangeHandler={volumeChangeHandler}
            handleFullScreen={handleFullScreen}
            videoDuration={videoDuration}
            isFullscreen={isFullscreen}
          />
        </Box>
      </Box>
    </Box>
  );
}
