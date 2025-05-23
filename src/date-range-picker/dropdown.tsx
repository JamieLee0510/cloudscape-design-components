// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import InternalAlert from '../alert/internal';
import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { CalendarProps } from '../calendar/interfaces';
import { useInternalI18n } from '../i18n/context';
import FocusLock from '../internal/components/focus-lock';
import InternalLiveRegion, { InternalLiveRegionRef } from '../live-region/internal';
import InternalSpaceBetween from '../space-between/internal';
import Calendar from './calendar';
import { DateRangePickerProps } from './interfaces';
import ModeSwitcher from './mode-switcher';
import RelativeRangePicker from './relative-range';
import { normalizeTimeOffset } from './time-offset';
import { formatValue, getDefaultMode, joinAbsoluteValue, splitAbsoluteValue } from './utils';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

const VALID_RANGE: DateRangePickerProps.ValidRangeResult = { valid: true };

interface DateRangePickerDropdownProps
  extends Pick<
      Required<DateRangePickerProps>,
      | 'locale'
      | 'isDateEnabled'
      | 'isValidRange'
      | 'value'
      | 'relativeOptions'
      | 'showClearButton'
      | 'dateOnly'
      | 'rangeSelectorMode'
    >,
    Pick<
      DateRangePickerProps,
      | 'startOfWeek'
      | 'getTimeOffset'
      | 'timeInputFormat'
      | 'timeOffset'
      | 'ariaLabelledby'
      | 'ariaDescribedby'
      | 'i18nStrings'
      | 'customRelativeRangeUnits'
      | 'dateDisabledReason'
    >,
    Pick<CalendarProps, 'granularity'> {
  onClear: () => void;
  onApply: (value: null | DateRangePickerProps.Value) => DateRangePickerProps.ValidationResult;
  onDropdownClose: () => void;
  isSingleGrid: boolean;
  customAbsoluteRangeControl: DateRangePickerProps.AbsoluteRangeControl | undefined;
}

export function DateRangePickerDropdown({
  locale = '',
  startOfWeek,
  isDateEnabled,
  dateDisabledReason = () => '',
  isValidRange,
  value,
  onClear: clearValue,
  onApply: applyValue,
  getTimeOffset,
  timeOffset,
  onDropdownClose,
  relativeOptions,
  showClearButton,
  isSingleGrid,
  i18nStrings,
  dateOnly,
  timeInputFormat,
  rangeSelectorMode,
  ariaLabelledby,
  ariaDescribedby,
  customAbsoluteRangeControl,
  customRelativeRangeUnits,
  granularity = 'day',
}: DateRangePickerDropdownProps) {
  const i18n = useInternalI18n('date-range-picker');
  const isMonthPicker = granularity === 'month';
  const hideTime = dateOnly || isMonthPicker;
  const liveRegionRef = useRef<InternalLiveRegionRef>(null);

  const [rangeSelectionMode, setRangeSelectionMode] = useState<'absolute' | 'relative'>(
    getDefaultMode(value, relativeOptions, rangeSelectorMode)
  );

  const [selectedAbsoluteRange, setSelectedAbsoluteRange] = useState<DateRangePickerProps.PendingAbsoluteValue>(() =>
    splitAbsoluteValue(value?.type === 'absolute' ? value : null, hideTime)
  );

  const [selectedRelativeRange, setSelectedRelativeRange] = useState<DateRangePickerProps.RelativeValue | null>(
    value?.type === 'relative' ? value : null
  );

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const applyButtonRef = useRef<ButtonProps.Ref>(null);

  const [applyClicked, setApplyClicked] = useState<boolean>(false);

  const [validationResult, setValidationResult] = useState<
    DateRangePickerProps.ValidRangeResult | DateRangePickerProps.InvalidRangeResult
  >(VALID_RANGE);

  const closeDropdown = () => {
    setApplyClicked(false);
    onDropdownClose();
  };

  const onClear = () => {
    closeDropdown();
    clearValue();
  };

  const onApply = () => {
    const newValue =
      rangeSelectionMode === 'relative' ? selectedRelativeRange : joinAbsoluteValue(selectedAbsoluteRange, hideTime);
    const newValidationResult = applyValue(newValue);
    if (newValidationResult.valid === false) {
      setApplyClicked(true);
      setValidationResult(newValidationResult);
      liveRegionRef.current?.reannounce();
    } else {
      setApplyClicked(false);
      closeDropdown();
    }
  };

  useEffect(() => {
    if (applyClicked) {
      const visibleRange =
        rangeSelectionMode === 'relative' ? selectedRelativeRange : joinAbsoluteValue(selectedAbsoluteRange);
      const formattedRange = formatValue(visibleRange, {
        dateOnly,
        monthOnly: isMonthPicker,
        timeOffset: dateOnly || isMonthPicker ? null : normalizeTimeOffset(visibleRange, getTimeOffset, timeOffset),
      });
      const newValidationResult = isValidRange(formattedRange);
      setValidationResult(newValidationResult || VALID_RANGE);
    }
  }, [
    applyClicked,
    isValidRange,
    rangeSelectionMode,
    selectedRelativeRange,
    selectedAbsoluteRange,
    setValidationResult,
    dateOnly,
    isMonthPicker,
    getTimeOffset,
    timeOffset,
  ]);

  useEffect(() => scrollableContainerRef.current?.focus(), [scrollableContainerRef]);

  return (
    <>
      <FocusLock className={styles['focus-lock']} autoFocus={true}>
        <div
          ref={scrollableContainerRef}
          className={clsx(styles.dropdown, testutilStyles.dropdown)}
          tabIndex={0}
          role="dialog"
          aria-label={i18nStrings?.ariaLabel}
          aria-labelledby={ariaLabelledby ?? i18nStrings?.ariaLabelledby}
          aria-describedby={ariaDescribedby ?? i18nStrings?.ariaDescribedby}
        >
          <div
            className={clsx(styles['dropdown-content'], {
              [styles['one-grid']]: isSingleGrid,
            })}
          >
            <InternalSpaceBetween size="l">
              <InternalBox padding={{ top: 'm', horizontal: 'l' }}>
                <InternalSpaceBetween direction="vertical" size="s">
                  {rangeSelectorMode === 'default' && (
                    <ModeSwitcher
                      mode={rangeSelectionMode}
                      onChange={(mode: 'absolute' | 'relative') => {
                        setRangeSelectionMode(mode);
                        setApplyClicked(false);
                        setValidationResult(VALID_RANGE);
                      }}
                      i18nStrings={i18nStrings}
                    />
                  )}

                  {rangeSelectionMode === 'absolute' && (
                    <Calendar
                      value={selectedAbsoluteRange}
                      setValue={setSelectedAbsoluteRange}
                      locale={locale}
                      startOfWeek={startOfWeek}
                      isDateEnabled={isDateEnabled}
                      dateDisabledReason={dateDisabledReason}
                      i18nStrings={i18nStrings}
                      dateOnly={dateOnly}
                      timeInputFormat={timeInputFormat}
                      customAbsoluteRangeControl={customAbsoluteRangeControl}
                      granularity={granularity}
                    />
                  )}

                  {rangeSelectionMode === 'relative' && (
                    <RelativeRangePicker
                      isSingleGrid={isSingleGrid}
                      options={relativeOptions}
                      dateOnly={dateOnly}
                      initialSelection={selectedRelativeRange}
                      onChange={range => setSelectedRelativeRange(range)}
                      i18nStrings={i18nStrings}
                      customUnits={customRelativeRangeUnits}
                      granularity={granularity}
                    />
                  )}
                </InternalSpaceBetween>

                <InternalBox
                  className={testutilStyles['validation-section']}
                  margin={!validationResult.valid ? { top: 's' } : undefined}
                >
                  {!validationResult.valid && (
                    <>
                      <InternalAlert
                        type="error"
                        statusIconAriaLabel={i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
                      >
                        <span className={testutilStyles['validation-error']}>{validationResult.errorMessage}</span>
                      </InternalAlert>
                      <InternalLiveRegion hidden={true} tagName="span" ref={liveRegionRef}>
                        {validationResult.errorMessage}
                      </InternalLiveRegion>
                    </>
                  )}
                </InternalBox>
              </InternalBox>

              <div
                className={clsx(styles.footer, {
                  [styles['one-grid']]: isSingleGrid,
                  [styles['has-clear-button']]: showClearButton,
                })}
              >
                {showClearButton && (
                  <div className={styles['footer-button-wrapper']}>
                    <InternalButton
                      onClick={onClear}
                      className={testutilStyles['clear-button']}
                      variant="link"
                      formAction="none"
                    >
                      {i18n('i18nStrings.clearButtonLabel', i18nStrings?.clearButtonLabel)}
                    </InternalButton>
                  </div>
                )}
                <div className={styles['footer-button-wrapper']}>
                  <InternalSpaceBetween size="xs" direction="horizontal">
                    <InternalButton
                      onClick={closeDropdown}
                      className={testutilStyles['cancel-button']}
                      variant="link"
                      formAction="none"
                    >
                      {i18n('i18nStrings.cancelButtonLabel', i18nStrings?.cancelButtonLabel)}
                    </InternalButton>

                    <InternalButton
                      onClick={onApply}
                      className={testutilStyles['apply-button']}
                      ref={applyButtonRef}
                      formAction="none"
                    >
                      {i18n('i18nStrings.applyButtonLabel', i18nStrings?.applyButtonLabel)}
                    </InternalButton>
                  </InternalSpaceBetween>
                </div>
              </div>
            </InternalSpaceBetween>
          </div>
        </div>
      </FocusLock>
    </>
  );
}
