#!/bin/sh
trap "exit 1" INT

docker-compose -f resources/dev/sqs/docker-compose.yml up -d
sleep 2