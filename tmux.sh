#!/bin/bash

function newWindow() {
  TARGET=$(tmux new-window -P)
}

function splitHorizontally() {
  TARGET=$(tmux split-window -P -v -p ${1:-50} -t ${2:-$TARGET})
}

function splitVertically() {
  TARGET=$(tmux split-window -P -h -p ${1:-50} -t ${2:-$TARGET})
}

function run() {
  tmux send-keys -t ${TARGET} "$1" C-m
}

if [[ $TMUX ]]; then

  tmux bind q kill-session

  newWindow

  run "cd be-api && yarn run watch:po"

  splitHorizontally 75

  run "cd be-db && yarn run start"

  splitHorizontally 66

  run "cd fe-web && yarn run watch"

  splitHorizontally 50

  run "cd be-api && yarn run build && yarn run db:migrate up && yarn run watch"

  splitVertically 50 :2.1

  run "cd fe-web && yarn run watch:po"

  splitVertically 50 :2.3

  run "cd shared && yarn run watch"

  splitVertically 50 :2.5

  run "cd fe-web && yarn run watch:storybook";

else
  tmux new-session $0;
fi
