#!/bin/sh

rsync -h -v -r -P -t --include '*.cc' --include '*.gyp' --include='*/' --exclude='*' ./ tank:/root/tankwww/x200
ssh tank "cd /root/tankwww/x200;node-gyp build"
