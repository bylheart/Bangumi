/*
 * @Author: czy0729
 * @Date: 2019-03-29 10:38:12
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-05-21 20:36:35
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  createAppContainer,
  createStackNavigator,
  getActiveChildNavigationOptions
} from 'react-navigation'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import { BlurView } from 'expo'
import {
  Login,
  Subject,
  Search,
  Mono,
  Rakuen,
  Timeline,
  Topic,
  Notify,
  User,
  Zone,
  WebView
} from '@screens'
import { IOS } from '@constants'
import _ from '@styles'
import HomeScreen from './screens/home'
import config from './stacks/config'

const TabBarComponent = props => <BottomTabBar {...props} />
const HomeTab = createBottomTabNavigator(
  {
    Timeline,
    Home: HomeScreen,
    Rakuen
  },
  {
    initialRouteName: 'Home',
    tabBarComponent: props => {
      if (IOS) {
        return (
          <BlurView tint='default' intensity={100} style={styles.blurView}>
            <TabBarComponent {...props} style={styles.tabBarComponent} />
          </BlurView>
        )
      }
      return (
        <View style={styles.tarBarView}>
          <TabBarComponent {...props} style={styles.tabBarComponent} />
        </View>
      )
    },
    tabBarOptions: {
      activeTintColor: _.colorMain,
      inactiveTintColor: _.colorDesc
    },
    navigationOptions: ({ navigation, screenProps }) =>
      getActiveChildNavigationOptions(navigation, screenProps)
  }
)

const HomeStack = createStackNavigator(
  {
    HomeTab,
    Login,
    Mono,
    Search,
    Subject,
    Topic,
    User,
    WebView,
    Zone,
    Notify
  },
  {
    initialRouteName: 'HomeTab',
    initialRouteParams: {
      // subjectId: 100444, // 100444 204135 评论数 [43]248175 [6]204135 [1]18007 [0]273437
      // topicId: 'ep/805584',
      // userId: 419012,
      // monoId: 'person/538' // character/706 person/538
    },
    ...config
  }
)

export default createAppContainer(HomeStack)

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0
  },
  tarBarView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: _.colorPlain
  },
  tabBarComponent: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: _.colorBorder,
    backgroundColor: 'transparent'
  }
})