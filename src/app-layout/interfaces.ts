// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { FlowType } from '../internal/analytics/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { SomeRequired } from '../internal/types';

export interface BaseLayoutProps extends BaseComponentProps {
  /**
   * Specifies additional analytics-related metadata.
   * * `instanceIdentifier` - A unique string that identifies this component instance in your application.
   * * `flowType` -  Identifies the type of flow represented by the component.
   * **Note:** This API is currently experimental.
   * @analytics
   */
  analyticsMetadata?: AppLayoutProps.AnalyticsMetadata;

  /**
   * Determines the default behavior of the component based on some predefined page layouts.
   * Individual properties will always take precedence over the default coming from the content type.
   */
  contentType?: AppLayoutProps.ContentType;

  /**
   * Drawers property. If you set both `drawers` and `tools`, `drawers` will take precedence.

   * Each Drawer is an item in the drawers wrapper with the following properties:
   * * id (string) - the id of the drawer.
   * * content (React.ReactNode) - the content in the drawer.
   * * trigger (DrawerTrigger) - the button that opens and closes the active drawer.
   * * ariaLabels (DrawerAriaLabels) - the labels for the interactive elements of the drawer.
   * * badge (boolean) - Adds a badge to the corner of the icon to indicate a state change. For example: Unread notifications.
   * * resizable (boolean) - if the drawer is resizable or not.
   * * defaultSize (number) - starting size of the drawer. if not set, defaults to 290.
   * * onResize (({ size: number }) => void) - Fired when the active drawer is resized.
   *
   * #### DrawerTrigger
   * - `iconName` (IconProps.Name) - (Optional) Specifies the icon to be displayed.
   * - `iconSvg` (React.ReactNode) - (Optional) Specifies the SVG of a custom icon. For more information, see [SVG icon guidelines](/components/icon/?tabId=api#slots)
   *
   * #### DrawerAriaLabels
   * - `drawerName` (string) - Label for the drawer itself, and for the drawer trigger button tooltip text.
   * - `closeButton` (string) - (Optional) Label for the close button.
   * - `triggerButton` (string) - (Optional) Label for the trigger button.
   * - `resizeHandle` (string) - (Optional) Label for the resize handle.
   */
  drawers?: Array<AppLayoutProps.Drawer>;

  /**
   * The active drawer id. If you want to clear the active drawer, use `null`.
   */
  activeDrawerId?: string | null;

  /**
   * Fired when the active drawer is toggled.
   */
  onDrawerChange?: NonCancelableEventHandler<AppLayoutProps.DrawerChangeDetail>;

  /**
   * If `true`, disables outer paddings for the content slot.
   */
  disableContentPaddings?: boolean;

  /**
   * State of the navigation drawer.
   */
  navigationOpen?: boolean;

  /**
   * Navigation drawer width in pixels.
   */
  navigationWidth?: number;

  /**
   * If `true`, the navigation drawer is not displayed at all.
   */
  navigationHide?: boolean;

  /**
   * State of the tools drawer.
   */
  toolsOpen?: boolean;

  /**
   * If `true`, the tools drawer is not displayed at all.
   */
  toolsHide?: boolean;

  /**
   * Tools drawer width in pixels.
   */
  toolsWidth?: number;

  /**
   * Maximum main content panel width in pixels.
   *
   * If set to `Number.MAX_VALUE`, the main content panel will occupy the full available width.
   */
  maxContentWidth?: number;

  /**
   * Minimum main content panel width in pixels.
   */
  minContentWidth?: number;

  /**
   * If true, the notification slot is rendered above the scrollable
   * content area so it is always visible.
   */
  stickyNotifications?: boolean;

  /**
   * CSS selector for the application header.
   */
  headerSelector?: string;

  /**
   * CSS selector for the application footer.
   */
  footerSelector?: string;

  /**
   * Aria labels for the drawer operating buttons. Use this property to ensure accessibility.
   *
   * * `navigation` (string) - Label for the landmark that wraps the navigation drawer.
   * * `navigationClose` (string) - Label for the button that closes the navigation drawer.
   * * `navigationToggle` (string) - Label for the button that opens the navigation drawer.
   * * `notification` (string) - Label for the region that contains notification messages.
   * * `tools` (string) - Label for the landmark that wraps the tools drawer.
   * * `toolsClose` (string) - Label for the button that closes the tools drawer.
   * * `toolsToggle` (string) - Label for the button that opens the tools drawer.
   * * `drawers` (string) - Label for the landmark that wraps the active drawer.
   * * `drawersOverflow` (string) - Label for the ellipsis button with any overflow drawers.
   * * `drawersOverflowWithBadge` (string) - Label for the ellipsis button with any overflow drawers, with a badge.
   *
   * Example:
   * ```
   * {
   *   navigation: "Navigation drawer",
   *   navigationClose: "Close navigation drawer",
   *   navigationToggle: "Open navigation drawer",
   *   notifications: "Notifications",
   *   tools: "Help panel",
   *   toolsClose: "Close help panel",
   *   toolsToggle: "Open help panel",
   *   drawers: "Drawers",
   *   drawersOverflow: "Overflow drawers",
   *   drawersOverflowWithBadge: "Overflow drawers (Unread notifications)"
   * }
   * ```
   * @i18n
   */
  ariaLabels?: AppLayoutProps.Labels;

  /**
   * Navigation drawer.
   */
  navigation?: React.ReactNode;

  /**
   * Top area of the page content.
   * @deprecated Replaced by the `header` slot of the [content layout](/components/content-layout/) component.
   * @visualrefresh
   */
  contentHeader?: React.ReactNode;

  /**
   * Disables overlap between `contentHeader` and `content` slots.
   * @deprecated Replaced by the `disableOverlap` property of the [content layout](/components/content-layout/) component.
   * @visualrefresh
   */
  disableContentHeaderOverlap?: boolean;

  /**
   * Determines the visual treatment for the breadcrumbs and notifications slots. Specifically:
   * * `default` - Does not apply any visual treatment.
   * * `high-contrast` - Applies high-contrast to both slots. Use in conjunction with `headerVariant="high-contrast"` in ContentLayout.
   * @visualrefresh
   */
  headerVariant?: 'default' | 'high-contrast';

  /**
   * Main content.
   */
  content?: React.ReactNode;

  /**
   * Tools drawer.
   */
  tools?: React.ReactNode;

  /**
   * Displayed on top of the main content in the scrollable area.
   *
   * Conceived to contain notifications (flash messages).
   */
  notifications?: React.ReactNode;

  /**
   * Use this slot to add the [breadcrumb group component](/components/breadcrumb-group/) to the app layout.
   */
  breadcrumbs?: React.ReactNode;

  /**
   * Fired when the navigation drawer is toggled.
   */
  onNavigationChange?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;

  /**
   * Fired when the tools drawer is toggled.
   */
  onToolsChange?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;

  /**
   * Use this slot to add the [split panel component](/components/split-panel/) to the app layout.
   *
   * Note: If provided, this property should be set to `null` or `undefined` if a split panel should not be rendered.
   */
  splitPanel?: React.ReactNode;

  /**
   * The size of the split panel in pixels.
   */
  splitPanelSize?: number;

  /**
   * State of the split panel.
   */
  splitPanelOpen?: boolean;
  /**
   * Controls the split panel preferences.
   *
   * By default, the preference is `{ position: 'bottom' }`
   */
  splitPanelPreferences?: AppLayoutProps.SplitPanelPreferences;
  /**
   * Fired when the split panel is resized.
   */
  onSplitPanelResize?: NonCancelableEventHandler<AppLayoutProps.SplitPanelResizeDetail>;
  /**
   * Fired when the split panel is toggled.
   */
  onSplitPanelToggle?: NonCancelableEventHandler<AppLayoutProps.ChangeDetail>;
  /**
   * Fired when the split panel preferences change.
   */
  onSplitPanelPreferencesChange?: NonCancelableEventHandler<AppLayoutProps.SplitPanelPreferences>;
}

export interface AppLayoutProps extends BaseLayoutProps {
  /**
   * Activates a backwards-compatibility mode for applications with non-fixed headers and footers.
   * @deprecated This layout is being phased out and may miss some features.
   */
  disableBodyScroll?: boolean;
}

export namespace AppLayoutProps {
  export interface AnalyticsMetadata {
    instanceIdentifier?: string;
    flowType?: FlowType;
  }

  export type ContentType = 'default' | 'form' | 'table' | 'cards' | 'wizard' | 'dashboard';

  export interface Ref {
    /**
     * Manually closes the navigation drawer if it is necessary for the current
     * viewport size.
     */
    closeNavigationIfNecessary(): void;

    /**
     * Opens the tools panel if it is not already open. Note that it is preferable
     * to control the state by listening to `toolsChange` and providing `toolsOpen`.
     */
    openTools(): void;

    /**
     * Focuses the tools panel if it is open. Use this to focus the tools panel
     * after changing the content, for example when clicking on an 'info' link while
     * the panel is already open.
     */
    focusToolsClose(): void;

    /**
     * Focuses the active drawer. Use this to focus the active drawer after opening it programmatically.
     */
    focusActiveDrawer(): void;

    /**
     * Focuses the split panel if it is open.
     */
    focusSplitPanel(): void;
  }

  export interface Drawer {
    id: string;
    content: React.ReactNode;
    trigger?: {
      iconName?: IconProps.Name;
      iconSvg?: React.ReactNode;
    };
    ariaLabels: DrawerAriaLabels;
    badge?: boolean;
    resizable?: boolean;
    defaultSize?: number;
    onResize?: NonCancelableEventHandler<{ size: number }>;
    preserveInactiveContent?: boolean;
  }

  export interface DrawerAriaLabels {
    drawerName: string;
    closeButton?: string;
    triggerButton?: string;
    resizeHandle?: string;
    resizeHandleTooltipText?: string;
  }

  export interface Labels {
    notifications?: string;

    navigation?: string;
    navigationToggle?: string;
    navigationClose?: string;

    tools?: string;
    toolsToggle?: string;
    toolsClose?: string;

    drawers?: string;
    drawersOverflow?: string;
    drawersOverflowWithBadge?: string;
  }

  export interface ChangeDetail {
    open: boolean;
  }

  export interface SplitPanelResizeDetail {
    size: number;
  }

  export interface SplitPanelPreferences {
    position: 'side' | 'bottom';
  }
  // Duplicated the positions because using this definition in SplitPanelPreferences would display
  // 'AppLayoutProps.SplitPanelPosition' on the API docs instead of the string values.
  export type SplitPanelPosition = 'side' | 'bottom';

  export interface DrawerChangeDetail {
    activeDrawerId: string | null;
  }
}

export type AppLayoutPropsWithDefaults = SomeRequired<
  Omit<AppLayoutProps, 'headerSelector' | 'footerSelector'>,
  'contentType' | 'navigationWidth' | 'toolsWidth' | 'minContentWidth' | 'navigationOpen' | 'onNavigationChange'
> & {
  placement: {
    insetBlockStart: number;
    insetBlockEnd: number;
    insetInlineStart: number;
    insetInlineEnd: number;
    inlineSize: number;
  };
};
