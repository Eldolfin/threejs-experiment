#!/bin/sh

set -xe

cleanup() {
	pkill -P $$
}
trap cleanup EXIT

if command -v chromium >/dev/null; then
	PUPPETEER_EXECUTABLE_PATH=$(which chromium)
	export PUPPETEER_EXECUTABLE_PATH
fi

(
	cd ../
	npm run dev
) &

until curl --output /dev/null --silent --head --fail http://localhost:3000; do
	printf '.'
	sleep 1
done

npm run generate-thumbnails

mv ./*.png ../static/thumbnails
