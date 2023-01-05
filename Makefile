
BIN_NAME     	:= ELE
BUILD_VERSION   := $(shell date "+%Y%m%d.%H%M%S")
BUILD_TIME      := $(shell date "+%F %T")
COMMIT_SHA1     := $(shell git rev-parse HEAD)

all: debug

package:
	npm run build-host
	npm run build-win

debug:
	npm start

install:
	yarn install
