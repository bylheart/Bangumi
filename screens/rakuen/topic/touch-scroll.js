/*
 * @Author: czy0729
 * @Date: 2019-10-14 22:46:45
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-03-08 23:06:45
 */
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Flex, Text } from '@components'
import { _ } from '@stores'
import { getTimestamp, titleCase } from '@utils'
import { MODEL_RAKUEN_SCROLL_DIRECTION } from '@constants/model'

function TouchScroll({ onPress }, { $ }) {
  const { scrollDirection } = $.setting
  const { list } = $.comments
  if (
    scrollDirection === MODEL_RAKUEN_SCROLL_DIRECTION.getValue('隐藏') ||
    !list.length
  ) {
    return null
  }

  const styles = memoStyles()
  const { _time: readedTime } = $.readed
  const showFloor = [
    parseInt(list.length * 0.33333),
    parseInt(list.length * 0.66666),
    list.length - 1
  ]

  const isVertical =
    scrollDirection === MODEL_RAKUEN_SCROLL_DIRECTION.getValue('右边') ||
    scrollDirection === MODEL_RAKUEN_SCROLL_DIRECTION.getValue('左边')
  return (
    <Flex
      style={styles[`container${titleCase(scrollDirection)}`]}
      direction={isVertical ? 'column' : undefined}
    >
      <Flex.Item flex={isVertical ? 1 : 3}>
        <TouchableWithoutFeedback onPressIn={() => onPress(-1)}>
          <Flex
            style={isVertical ? styles.itemVertical : styles.itemHorizontal}
          >
            <Text style={styles.text} size={10} type='icon' align='center'>
              1
            </Text>
          </Flex>
        </TouchableWithoutFeedback>
      </Flex.Item>
      {list.map((item, index) => {
        let isNew = false
        if (readedTime) {
          if (getTimestamp(item.time) > readedTime) {
            isNew = true
          }

          if (!isNew) {
            if (item.sub) {
              item.sub.forEach(i => {
                if (getTimestamp(i.time) > readedTime) {
                  isNew = true
                }
              })
            }
          }
        }

        const showFloorText = showFloor.includes(index)
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Flex.Item key={index} flex={isVertical ? 1 : showFloorText ? 3 : 1}>
            <TouchableWithoutFeedback onPressIn={() => onPress(index)}>
              <Flex
                style={[
                  isVertical ? styles.itemVertical : styles.itemHorizontal,
                  isNew && styles.itemNew
                ]}
              >
                {showFloorText && (
                  <Text
                    style={styles.text}
                    size={10}
                    type={isNew ? _.select('plain', 'icon') : 'icon'}
                    align='center'
                  >
                    {list[index].floor.replace('#', '')}
                  </Text>
                )}
              </Flex>
            </TouchableWithoutFeedback>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}

TouchScroll.defaultProps = {
  onPress: Function.prototype
}

TouchScroll.contextTypes = {
  $: PropTypes.object
}

export default observer(TouchScroll)

const memoStyles = _.memoStyles(_ => ({
  containerRight: {
    position: 'absolute',
    zIndex: 1,
    top: _.headerHeight,
    right: 0,
    bottom: 42,
    width: 16
  },
  containerLeft: {
    position: 'absolute',
    zIndex: 1,
    top: _.headerHeight,
    left: 0,
    bottom: 42,
    width: 16
  },
  containerBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    width: '100%',
    height: 24,
    backgroundColor: _.select(_.colorPlain, _._colorDarkModeLevel1)
  },
  itemVertical: {
    width: 16,
    height: '100%'
  },
  itemHorizontal: {
    width: '100%',
    height: '100%'
  },
  itemNew: {
    backgroundColor: _.select(
      'rgba(254, 138, 149, 0.64)',
      'rgba(254, 113, 127, 0.16)'
    )
  },
  text: {
    width: '100%'
  }
}))
