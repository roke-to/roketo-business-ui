import clsx from 'clsx';
import {useGate, useStoreMap, useUnit} from 'effector-react';
import React, {useState} from 'react';
import Modal from 'react-modal';

import {blurGate} from '~/entities/blur';
import {$isMobileScreen} from '~/entities/screens';

import {Filter, FilterOptionWithCounter} from '@roketo/core/kit/Filter';
import {RadioButton} from '@roketo/core/kit/RadioButton';
import {Button} from '@roketo/core/roketo-ui/components/Button';
import {OrderType, SortIcon} from '@roketo/core/roketo-ui/icons/Sort';

import {directionOptions, sortOptions, statusOptions} from '../constants';
import {
  $allStreams,
  $statusFilterCounts,
  $streamFilter,
  $streamSort,
  changeDirectionFilter,
  changeStatusFilter,
  changeStreamSort,
  changeTextFilter,
} from '../model';
import clearIcon from './clear.svg';
import magnifierIcon from './magnifier.svg';
import styles from './styles.module.scss';

export function StreamFilters({className}: {className: string}) {
  const [showInput, setShowInput] = useState(false);
  const [showCompactFilterModal, setShowCompactFilterModal] = useState(false);

  const [
    sorting,
    {direction: activeDirection, status, text: filterText},
    statusFilterCounts,
    isMobileScreen,
  ] = useUnit([$streamSort, $streamFilter, $statusFilterCounts, $isMobileScreen]);

  const isEmptyList = useStoreMap($allStreams, (items) => items.length === 0);

  useGate(blurGate, {
    modalId: 'compactFilterModal',
    active: isMobileScreen && showCompactFilterModal,
  });

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.directionSorts}>
        {directionOptions.map((direction) => (
          <Button
            key={direction}
            className={clsx(styles.directionSort, {
              [styles.directionActive]: direction === activeDirection,
            })}
            onClick={() => changeDirectionFilter(direction)}
            disabled={isEmptyList}
          >
            {direction}
          </Button>
        ))}
      </div>
      <div className={clsx(styles.textFilter, showInput && styles.withInput)} key='text-filter'>
        <img src={magnifierIcon} className={styles.textFilterMagnifier} alt='search' />
        <input
          className={styles.textFilterInput}
          value={filterText}
          onChange={(e) => changeTextFilter(e.currentTarget.value)}
          onFocus={() => setShowInput(true)}
          onBlur={(e) => {
            const isEmptyInput = e.currentTarget.value.trim() === '';
            if (isEmptyInput) {
              setShowInput(false);
            }
          }}
          placeholder='Search text'
        />
        <button
          type='button'
          className={styles.textFilterClear}
          onClick={() => {
            setShowInput(false);
            changeTextFilter('');
          }}
        >
          <img src={clearIcon} alt='clear' />
        </button>
      </div>
      <Filter
        options={statusOptions}
        label='Status:'
        active={status}
        onChange={changeStatusFilter}
        isDisabled={isEmptyList}
        className={styles.statusBlock}
        controlClassName={styles.filterControl}
        renderOption={(option) => (
          <FilterOptionWithCounter
            key={option}
            option={option}
            count={statusFilterCounts[option]}
          />
        )}
      />
      <Filter
        options={sortOptions}
        label='Sort by:'
        active={sorting}
        onChange={changeStreamSort}
        isDisabled={isEmptyList}
        className={styles.sortBlock}
        controlClassName={styles.filterControl}
        renderOption={(option) => <span>{option.label}</span>}
        renderActive={(option) => (
          <div className={styles.sortWithOrder}>
            {option.order && <SortIcon type={option.order} />}
            <span>{option.label}</span>
          </div>
        )}
      />
      <Modal
        isOpen={isMobileScreen && showCompactFilterModal}
        onRequestClose={() => setShowCompactFilterModal(false)}
        className={clsx(styles.modalContent, styles.compactFilterModal)}
        overlayClassName={clsx(styles.modalOverlay)}
      >
        <h3>Direction:</h3>
        {directionOptions.map((direction) => (
          <RadioButton
            key={direction}
            active={direction === activeDirection}
            label={<span>{direction}</span>}
            value={direction}
            onChange={changeDirectionFilter}
          />
        ))}
        <h3>Status:</h3>
        {statusOptions.map((option) => (
          <RadioButton
            key={option}
            active={option === status}
            label={
              <span>
                {option} <span className={styles.countText}>{statusFilterCounts[option]}</span>
              </span>
            }
            value={option}
            onChange={changeStatusFilter}
          />
        ))}
        <h3>Show first:</h3>
        {sortOptions.map((sort) => (
          <RadioButton
            key={sort.label}
            label={<span>{sort.label}</span>}
            active={sort === sorting}
            value={sort}
            onChange={changeStreamSort}
          />
        ))}
      </Modal>
      <Button
        className={clsx(styles.directionSort, styles.compactFilter)}
        onClick={() => setShowCompactFilterModal(!showCompactFilterModal)}
        disabled={isEmptyList}
      >
        <SortIcon type={OrderType.desc} />
      </Button>
    </div>
  );
}
