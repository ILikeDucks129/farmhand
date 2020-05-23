import React from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Tooltip from '@material-ui/core/Tooltip'
import { bool, func, number, object } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items } from '../../img'
import { itemsMap } from '../../data/maps'
import { getItemValue } from '../../utils'

import './Item.sass'

const ValueIndicator = ({
  id,
  value,
  valueAdjustments,

  poorValue,
}) => (
  <Tooltip
    {...{
      placement: 'right',
      title: `${poorValue ? 'Poor' : 'Good'} opportunity`,
    }}
  >
    {poorValue ? (
      <KeyboardArrowDown color="error" />
    ) : (
      <KeyboardArrowUp color="primary" />
    )}
  </Tooltip>
)

const PurchaseValueIndicator = ({
  id,
  value,
  valueAdjustments,

  poorValue = value > itemsMap[id].value,
}) => (
  <ValueIndicator
    {...{
      id,
      poorValue,
      value,
      valueAdjustments,
    }}
  />
)

const SellValueIndicator = ({
  id,
  value,
  valueAdjustments,

  poorValue = value < itemsMap[id].value,
}) => (
  <ValueIndicator
    {...{
      id,
      poorValue,
      value,
      valueAdjustments,
    }}
  />
)

export const Item = ({
  bulkPurchaseSize,
  handleItemMaxOutClick,
  handleItemPurchaseClick,
  handleItemSelectClick,
  handleItemSellAllClick,
  handleItemSellClick,
  isPurchaseView,
  isSelectView,
  isSelected,
  isSellView,
  item,
  item: { id, name },
  money,
  playerInventoryQuantities,
  valueAdjustments,

  adjustedValue = getItemValue(item, valueAdjustments),
}) => (
  <Card
    {...{
      className: classNames('Item', { 'is-selected': isSelected }),
      raised: isSelected,
    }}
  >
    <CardHeader
      {...{
        avatar: <img {...{ src: items[id] }} alt={name} />,
        title: name,
        subheader: (
          <div>
            {isPurchaseView && (
              <p>
                {`Price: $${adjustedValue}`}
                {valueAdjustments[id] && (
                  <PurchaseValueIndicator
                    {...{ id, value: adjustedValue, valueAdjustments }}
                  />
                )}
              </p>
            )}
            {isSellView && (
              <p>
                {`Sell price: $${adjustedValue}`}
                {valueAdjustments[id] && (
                  <SellValueIndicator
                    {...{ id, value: adjustedValue, valueAdjustments }}
                  />
                )}
              </p>
            )}
            <p>
              <strong>Quantity:</strong> {playerInventoryQuantities[id]}
            </p>
          </div>
        ),
      }}
    />
    <CardActions>
      {isSelectView && (
        <Button
          {...{
            className: 'select',
            color: 'primary',
            onClick: () => handleItemSelectClick(item),
            variant: isSelected ? 'contained' : 'outlined',
          }}
        >
          Select
        </Button>
      )}
      {isPurchaseView && (
        <>
          <Button
            {...{
              className: 'purchase',
              color: 'primary',
              disabled: adjustedValue > money,
              onClick: () => handleItemPurchaseClick(item),
              variant: 'contained',
            }}
          >
            Buy
          </Button>
          {bulkPurchaseSize && (
            <Button
              {...{
                className: 'bulk purchase',
                color: 'primary',
                disabled: adjustedValue * bulkPurchaseSize > money,
                onClick: () => handleItemPurchaseClick(item, bulkPurchaseSize),
                variant: 'contained',
              }}
            >
              Buy {bulkPurchaseSize}
            </Button>
          )}
          <Button
            {...{
              className: 'max-out',
              color: 'primary',
              disabled: adjustedValue > money,
              onClick: () => handleItemMaxOutClick(item),
              variant: 'contained',
            }}
          >
            Max Out
          </Button>
        </>
      )}
      {/*
        FIXME: Disable the sell buttons if quantity === 0.
      */}
      {isSellView && (
        <>
          <Button
            {...{
              className: 'sell',
              color: 'secondary',
              onClick: () => handleItemSellClick(item),
              variant: 'contained',
            }}
          >
            Sell
          </Button>
          <Button
            {...{
              className: 'sell-all',
              color: 'secondary',
              onClick: () => handleItemSellAllClick(item),
              variant: 'contained',
            }}
          >
            Sell All
          </Button>
        </>
      )}
    </CardActions>
  </Card>
)

Item.propTypes = {
  adjustedValue: number,
  bulkPurchaseSize: number,
  handleItemMaxOutClick: func,
  handleItemPurchaseClick: func,
  handleItemSelectClick: func,
  handleItemSellClick: func,
  isPurchaseView: bool,
  isSelectView: bool,
  isSelected: bool,
  isSellView: bool,
  item: object.isRequired,
  money: number.isRequired,
  playerInventoryQuantities: object.isRequired,
  valueAdjustments: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Item {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
