// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalBox from '../../box/internal';
import { CalendarProps } from '../../calendar/interfaces';
import InternalFormField from '../../form-field/internal';
import { useInternalI18n } from '../../i18n/context';
import InternalInput from '../../input/internal';
import { RadioGroupProps } from '../../radio-group/interfaces';
import InternalRadioGroup from '../../radio-group/internal';
import InternalSelect from '../../select/internal';
import InternalSpaceBetween from '../../space-between/internal';
import { DateRangePickerProps } from '../interfaces';

import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

interface RelativeRangePickerProps extends Pick<CalendarProps, 'granularity'> {
  dateOnly: boolean;
  options: ReadonlyArray<DateRangePickerProps.RelativeOption>;
  initialSelection: DateRangePickerProps.RelativeValue | null;
  onChange: (range: DateRangePickerProps.RelativeValue) => void;
  i18nStrings?: DateRangePickerProps.I18nStrings;
  isSingleGrid: boolean;
  customUnits?: DateRangePickerProps.TimeUnit[];
}

interface UnitSelectOption {
  value: DateRangePickerProps.TimeUnit;
  label: string;
}

const monthUnits: ReadonlyArray<DateRangePickerProps.TimeUnit> = ['month', 'year'];
const dayUnits: ReadonlyArray<DateRangePickerProps.TimeUnit> = ['day', 'week', ...monthUnits];
const units: ReadonlyArray<DateRangePickerProps.TimeUnit> = ['second', 'minute', 'hour', ...dayUnits];

const CUSTOM_OPTION_SELECT_KEY = 'awsui-internal-custom-duration-key';

export default function RelativeRangePicker({
  dateOnly,
  options: clientOptions = [],
  initialSelection: initialRange,
  onChange: onChangeRangeSize,
  i18nStrings,
  isSingleGrid,
  customUnits,
  granularity = 'day',
}: RelativeRangePickerProps) {
  const i18n = useInternalI18n('date-range-picker');
  const formatRelativeRange = i18n(
    'i18nStrings.formatRelativeRange',
    i18nStrings?.formatRelativeRange,
    format =>
      ({ amount, unit }) =>
        format({ amount, unit })
  );
  const formatUnit = i18n(
    'i18nStrings.formatUnit',
    i18nStrings?.formatUnit,
    format => (unit, amount) => format({ amount, unit })
  );

  const radioOptions: RadioGroupProps.RadioButtonDefinition[] = clientOptions.map(option => ({
    value: option.key,
    label: formatRelativeRange?.(option),
  }));
  radioOptions.push({
    value: CUSTOM_OPTION_SELECT_KEY,
    label: i18n('i18nStrings.customRelativeRangeOptionLabel', i18nStrings?.customRelativeRangeOptionLabel),
    description: i18n(
      'i18nStrings.customRelativeRangeOptionDescription',
      i18nStrings?.customRelativeRangeOptionDescription
    ),
  });

  const [selectedRadio, setSelectedRadio] = useState(() => {
    if (initialRange && !initialRange.key) {
      return CUSTOM_OPTION_SELECT_KEY;
    }
    return initialRange?.key ?? null;
  });

  const [customDuration, setCustomDuration] = useState(() => {
    if (initialRange) {
      return initialRange.amount;
    }
    // NaN represents an empty duration
    return NaN;
  });

  let finalUnits = granularity === 'month' ? monthUnits : dateOnly ? dayUnits : units;
  if (customUnits) {
    finalUnits = customUnits.filter(unit => {
      if (units.includes(unit)) {
        return true;
      }
      warnOnce(
        'DateRangePicker',
        `Invalid unit found in customRelativeRangeUnits: ${unit}. This entry will be ignored.`
      );
      return false;
    });
  }

  let initialCustomTimeUnit: DateRangePickerProps.TimeUnit =
    granularity === 'month' ? 'month' : dateOnly ? 'day' : 'minute';
  if (!finalUnits.includes(initialCustomTimeUnit)) {
    initialCustomTimeUnit = finalUnits[0];
  }
  const [customUnitOfTime, setCustomUnitOfTime] = useState<DateRangePickerProps.TimeUnit>(
    initialRange?.unit ?? initialCustomTimeUnit
  );

  const showRadioControl = clientOptions.length > 0;
  const showCustomControls = clientOptions.length === 0 || selectedRadio === CUSTOM_OPTION_SELECT_KEY;

  return (
    <div>
      <InternalSpaceBetween size="xs" direction="vertical">
        {showRadioControl && (
          <InternalFormField
            {...{
              label: i18n('i18nStrings.relativeRangeSelectionHeading', i18nStrings?.relativeRangeSelectionHeading),
              description:
                granularity === 'month' &&
                i18n(
                  'i18nStrings.relativeRangeSelectionMonthlyDescription',
                  i18nStrings?.relativeRangeSelectionMonthlyDescription
                ),
            }}
          >
            <InternalRadioGroup
              className={testutilStyles['relative-range-radio-group']}
              onChange={({ detail }) => {
                setSelectedRadio(detail.value);

                if (detail.value === CUSTOM_OPTION_SELECT_KEY) {
                  setCustomDuration(NaN);
                  setCustomUnitOfTime(initialCustomTimeUnit);
                  onChangeRangeSize({
                    amount: NaN,
                    unit: initialCustomTimeUnit,
                    type: 'relative',
                  });
                } else {
                  const option = clientOptions.filter(o => o.key === detail.value)[0];
                  onChangeRangeSize(option);
                }
              }}
              value={selectedRadio}
              items={radioOptions}
            />
          </InternalFormField>
        )}

        {showCustomControls && (
          <InternalSpaceBetween direction="vertical" size="xs">
            {!showRadioControl && (
              <InternalBox fontSize="body-m" color="text-body-secondary">
                {i18n(
                  'i18nStrings.customRelativeRangeOptionDescription',
                  i18nStrings?.customRelativeRangeOptionDescription
                )}
              </InternalBox>
            )}

            <div
              className={clsx(styles['custom-range'], {
                [styles['custom-range--no-padding']]: !showRadioControl,
              })}
            >
              <div
                className={clsx(styles['custom-range-form-controls'], {
                  [styles.vertical]: isSingleGrid,
                })}
              >
                <div className={styles['custom-range-duration']}>
                  <InternalFormField
                    label={i18n(
                      'i18nStrings.customRelativeRangeDurationLabel',
                      i18nStrings?.customRelativeRangeDurationLabel
                    )}
                  >
                    <InternalInput
                      type="number"
                      className={testutilStyles['custom-range-duration-input']}
                      value={isNaN(customDuration) || customDuration === 0 ? '' : customDuration?.toString()}
                      onChange={e => {
                        const amount = Number(e.detail.value);

                        setCustomDuration(amount);
                        onChangeRangeSize({ amount, unit: customUnitOfTime, type: 'relative' });
                      }}
                      placeholder={i18n(
                        'i18nStrings.customRelativeRangeDurationPlaceholder',
                        i18nStrings?.customRelativeRangeDurationPlaceholder
                      )}
                      __inheritFormFieldProps={true}
                    />
                  </InternalFormField>
                </div>

                <div className={styles['custom-range-unit']}>
                  <InternalFormField
                    label={i18n('i18nStrings.customRelativeRangeUnitLabel', i18nStrings?.customRelativeRangeUnitLabel)}
                  >
                    <InternalSelect
                      className={testutilStyles['custom-range-unit-select']}
                      selectedOption={
                        {
                          value: customUnitOfTime,
                          label: formatUnit?.(customUnitOfTime, customDuration),
                        } as UnitSelectOption
                      }
                      onChange={e => {
                        const { value: unit } = e.detail.selectedOption as UnitSelectOption;

                        setCustomUnitOfTime(unit);
                        onChangeRangeSize({ amount: customDuration, unit, type: 'relative' });
                      }}
                      options={finalUnits.map(unit => ({
                        value: unit,
                        label: formatUnit?.(unit, customDuration),
                      }))}
                      renderHighlightedAriaLive={option => option.label || option.value || ''}
                    />
                  </InternalFormField>
                </div>
              </div>
            </div>
          </InternalSpaceBetween>
        )}
      </InternalSpaceBetween>
    </div>
  );
}
