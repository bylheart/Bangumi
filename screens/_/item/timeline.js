/*
 * @Author: czy0729
 * @Date: 2019-05-08 17:13:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-05-21 20:34:09
 */
import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { observer } from 'mobx-react'
import { Modal } from '@ant-design/react-native'
import { Flex, Text, Image, Iconfont, Touchable } from '@components'
import { appNavigate } from '@utils/app'
import _ from '@styles'
import Stars from '../stars'

const avatarWidth = 28
const regSubject = /\/\/bgm.tv\/subject\/\d+$/

class TimelineItem extends React.Component {
  static defaultProps = {
    navigation: null,
    avatar: {},
    p1: {},
    p2: {},
    p3: {
      text: [],
      url: []
    },
    p4: {},
    reply: {},
    image: []
  }

  appNavigate = url => {
    const { navigation } = this.props
    appNavigate(url, navigation)
  }

  renderP3() {
    const { p3 } = this.props

    // 位置3: 多个条目信息
    let $p3
    if (p3.text.length > 1) {
      $p3 = []
      p3.text.forEach((item, index) => {
        const url = String(p3.url[index])
        const isSubject = !!url.match(regSubject)
        $p3.push(
          <Text
            key={item}
            type={isSubject ? undefined : 'main'}
            underline={isSubject}
            size={12}
            onPress={() => this.appNavigate(url)}
          >
            {item}
          </Text>,
          <Text key={`${item}.`} size={12}>
            、
          </Text>
        )
      })
      $p3.pop()
    } else if (p3.text.length === 1) {
      const isSubject = !!String(p3.url[0]).match(regSubject)
      $p3 = (
        <Text
          type={isSubject ? undefined : 'main'}
          underline={isSubject}
          size={12}
          onPress={() => this.appNavigate(p3.url[0])}
        >
          {p3.text[0]}
        </Text>
      )
    }

    return $p3
  }

  renderP() {
    const { p1, p2, p3, p4 } = this.props

    // 是否渲染第一行
    const hasPosition = !!(p1.text || p2.text || p3.text.length || p4.text)
    if (!hasPosition) {
      return null
    }

    return (
      <Text>
        {!!p1.text && (
          <Text type='main' size={12} onPress={() => this.appNavigate(p1.url)}>
            {p1.text}{' '}
          </Text>
        )}
        <Text size={12}>{p2.text} </Text>
        {this.renderP3()}
        {!!p4.text && <Text size={12}> {p4.text}</Text>}
      </Text>
    )
  }

  renderDesc() {
    const { navigation, subject, subjectId, comment, reply } = this.props
    return (
      <>
        {!!subject && (
          <Text
            style={_.mt.sm}
            underline
            onPress={() => {
              navigation.push('Subject', {
                subjectId
              })
            }}
          >
            {subject}
          </Text>
        )}
        {!!(comment || reply.content) && (
          <Text style={_.mt.sm} lineHeight={20}>
            {comment || reply.content}
          </Text>
        )}
      </>
    )
  }

  renderImages() {
    const { p3, image } = this.props
    if (image.length <= 1) {
      return null
    }

    const images = image.map((item, index) => (
      <Image
        key={item}
        style={_.mr.sm}
        src={item}
        size={48}
        radius
        border={_.colorBorder}
        onPress={() => this.appNavigate(p3.url[index])}
      />
    ))
    if (image.length <= 5) {
      return (
        <Flex style={_.mt.sm} wrap='wrap'>
          {images}
        </Flex>
      )
    }

    // 有一次性操作很多条目很多图片的情况, 水平滚动比较合适
    return (
      <ScrollView style={_.mt.sm} horizontal>
        {images}
      </ScrollView>
    )
  }

  render() {
    const {
      style,
      index,
      avatar,
      p3,
      star,
      reply,
      time,
      image,
      clearHref,
      onDelete
    } = this.props
    return (
      <Flex style={[styles.item, style]} align='start'>
        <View style={styles.image}>
          {!!avatar.src && (
            <Image
              src={avatar.src}
              size={avatarWidth}
              radius
              border={_.colorBorder}
              onPress={() => this.appNavigate(avatar.url)}
            />
          )}
        </View>
        <Flex.Item
          style={[styles.content, index !== 0 && styles.border, _.ml.sm]}
        >
          <Flex align='start'>
            <Flex.Item>
              {this.renderP()}
              {this.renderDesc()}
              {this.renderImages()}
              <Flex style={_.mt.md} align='baseline'>
                {!!reply.count && (
                  <Text type='primary' size={12}>
                    {reply.count}
                  </Text>
                )}
                <Text style={_.mr.sm} type='sub' size={12}>
                  {time}
                </Text>
                <Stars value={star} />
              </Flex>
            </Flex.Item>
            <Flex align='start'>
              {image.length === 1 && (
                <Image
                  style={_.ml.sm}
                  src={image[0]}
                  size={48}
                  radius
                  border={_.colorBorder}
                  onPress={() => this.appNavigate(p3.url[0])}
                />
              )}
              {!!clearHref && (
                <Touchable
                  style={_.ml.sm}
                  onPress={() => {
                    Modal.alert(
                      '确定删除?',
                      <Text style={{ marginTop: -16 }} />, // 缩短一下这个描述的高度
                      [
                        {
                          text: '取消',
                          style: {
                            color: _.colorSub
                          }
                        },
                        {
                          text: '确定',
                          style: {
                            color: _.colorDanger
                          },
                          onPress: () => onDelete(clearHref)
                        }
                      ]
                    )
                  }}
                >
                  <Iconfont style={styles.del} name='close' size={12} />
                </Touchable>
              )}
            </Flex>
          </Flex>
        </Flex.Item>
      </Flex>
    )
  }
}

TimelineItem.defaultProps = {
  onDelete: Function.prototype
}

export default observer(TimelineItem)

const styles = StyleSheet.create({
  item: {
    backgroundColor: _.colorPlain
  },
  image: {
    width: avatarWidth,
    marginTop: _.md,
    marginLeft: _.wind
  },
  content: {
    paddingVertical: _.md,
    paddingRight: _.wind
  },
  border: {
    borderTopColor: _.colorBorder,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  del: {
    padding: _.sm,
    marginTop: -_.sm,
    marginRight: -_.sm,
    width: 12 + _.sm * 2,
    height: 12 + _.sm * 2
  }
})