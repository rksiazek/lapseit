#!/bin/bash

# Stop on error
set -e

# Install dependencies

wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar xf ffmpeg-release-amd64-static.tar.xz

mkdir -p $HOME/bin
cp ffmpeg-*-static/ffmpeg ffmpeg-*-static/ffprobe $HOME/bin
cp ffmpeg-*-static/ffmpeg ffmpeg-*-static/ffprobe $(pwd)

export PATH=$(pwd)/bin:$PATH
export ALT_FFMPEG_PATH=$(pwd)/ffmpeg
export ALT_FFPROBE_PATH=$(pwd)/ffprobe

# Print version

echo "ffmpeg version: $(ffmpeg -version)"