#!/bin/sh

rsync -h -v -r -P -t --include '*.jade' --include '*.css' --include '*.js' --include '*.sh' --include='*/' --exclude='*' ./ tank:/root/tankwww/
