// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Direction } from '../../internal/components/drag-handle-wrapper/interfaces';
import handleKey from '../../internal/utils/handle-key';
import { SizeControlProps } from './interfaces';

const KEYBOARD_SINGLE_STEP_SIZE = 10;
const KEYBOARD_MULTIPLE_STEPS_SIZE = 60;

const getCurrentSize = (panelRef?: React.RefObject<HTMLDivElement>) => {
  if (!panelRef || !panelRef.current) {
    return {
      panelHeight: 0,
      panelWidth: 0,
    };
  }

  return {
    panelHeight: panelRef.current.clientHeight,
    panelWidth: panelRef.current.clientWidth,
  };
};

export const useKeyboardEvents = ({ position, onResize, panelRef }: SizeControlProps) => {
  return {
    onDirectionClick: (direction: Direction) => {
      let currentSize: number;

      const { panelHeight, panelWidth } = getCurrentSize(panelRef);

      if (position === 'side') {
        currentSize = panelWidth;
      } else {
        currentSize = panelHeight;
      }

      const singleStepUp = () => onResize(currentSize + KEYBOARD_SINGLE_STEP_SIZE);
      const singleStepDown = () => onResize(currentSize - KEYBOARD_SINGLE_STEP_SIZE);

      switch (direction) {
        case 'block-start':
        case 'inline-start':
          singleStepUp();
          break;
        case 'block-end':
        case 'inline-end':
          singleStepDown();
          break;
      }
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      let currentSize: number;
      let maxSize: number;

      const { panelHeight, panelWidth } = getCurrentSize(panelRef);

      if (position === 'side') {
        currentSize = panelWidth;
        // don't need the exact max size as it's constrained in the set size function
        maxSize = window.innerWidth;
      } else {
        currentSize = panelHeight;
        // don't need the exact max size as it's constrained in the set size function
        maxSize = window.innerHeight;
      }

      let isEventHandled = true;

      const singleStepUp = () => onResize(currentSize + KEYBOARD_SINGLE_STEP_SIZE);
      const singleStepDown = () => onResize(currentSize - KEYBOARD_SINGLE_STEP_SIZE);
      const multipleStepUp = () => onResize(currentSize + KEYBOARD_MULTIPLE_STEPS_SIZE);
      const multipleStepDown = () => onResize(currentSize - KEYBOARD_MULTIPLE_STEPS_SIZE);

      handleKey(event, {
        onBlockStart: () => {
          position === 'bottom' ? singleStepUp() : singleStepDown();
        },
        onBlockEnd: () => {
          position === 'bottom' ? singleStepDown() : singleStepUp();
        },
        onInlineEnd: () => {
          position === 'bottom' ? singleStepUp() : singleStepDown();
        },
        onInlineStart: () => {
          position === 'bottom' ? singleStepDown() : singleStepUp();
        },
        onPageDown: () => multipleStepDown(),
        onPageUp: () => multipleStepUp(),
        onHome: () => onResize(maxSize),
        onEnd: () => onResize(0),
        onDefault: () => (isEventHandled = false),
      });

      if (isEventHandled) {
        event.preventDefault();
      }
    },
  };
};
