// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { initAwsUiVersions } from '@cloudscape-design/component-toolkit/internal';

import { AnalyticsMetadata } from '../analytics/interfaces';
import { PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from '../environment';
import { isDevelopment } from '../is-development';

// these styles needed to be imported for every public component
import './styles.css.js';

initAwsUiVersions(PACKAGE_SOURCE, PACKAGE_VERSION);

export interface BaseComponentProps {
  /**
   * Adds the specified classes to the root element of the component.
   * @deprecated Custom CSS is not supported. For testing and other use cases, use [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).
   */
  className?: string;
  /**
   * Adds the specified ID to the root element of the component.
   * @deprecated The usage of the `id` attribute is reserved for internal use cases. For testing and other use cases,
   * use [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). If you must
   * use the `id` attribute, consider setting it on a parent element instead.
   */
  id?: string;
  // we also support data-* attributes, but they are always implicitly allowed by typescript
  // http://www.typescriptlang.org/docs/handbook/jsx.html#attribute-type-checking
  // "Note: If an attribute name is not a valid JS identifier (like a data-* attribute), it is not considered to be an error"
}

export function getBaseProps(props: BaseComponentProps) {
  const baseProps: Record<string, any> = {};
  Object.keys(props).forEach(prop => {
    if (prop === 'id' || prop === 'className' || prop.match(/^data-/)) {
      baseProps[prop] = (props as Record<string, any>)[prop];
    }
  });
  return baseProps as BaseComponentProps;
}

export function validateProps(
  componentName: string,
  props: Record<string, any>,
  excludedProps: Array<string>,
  allowedEnums: Record<string, Array<string>>
) {
  if (!isDevelopment) {
    return;
  }
  for (const [prop, value] of Object.entries(props)) {
    if (excludedProps.includes(prop)) {
      throw new Error(`${componentName} does not support "${prop}" property when used in ${THEME} theme`);
    }
    if (value && allowedEnums[prop] && !allowedEnums[prop].includes(value)) {
      throw new Error(`${componentName} does not support "${prop}" with value "${value}" when used in ${THEME} theme`);
    }
  }
}

export interface BasePropsWithAnalyticsMetadata {
  analyticsMetadata?: AnalyticsMetadata;
  __analyticsMetadata?: AnalyticsMetadata;
}

/**
 * Helper function to merge beta analytics metadata with the public analytics metadata api.
 * Beta analytics metadata will override the public values to allow for safe migration.
 */
export function getAnalyticsMetadataProps<T extends BasePropsWithAnalyticsMetadata>(
  props?: T
): NonNullable<T['analyticsMetadata'] & T['__analyticsMetadata']> {
  return { ...props?.analyticsMetadata, ...props?.__analyticsMetadata };
}
