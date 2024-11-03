import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feed from './../Page/Home/Feed';
import Notifications from '../Page/Home/Product';
import Profile from './../Page/Home/Profile';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Blogs from '../Page/Home/blog';
import Product from '../Page/Home/Product';
const Tab = createBottomTabNavigator();

export default function MyTab() {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#0058c0',
                tabBarInactiveTintColor: '#777777',

                tabBarStyle: {
                    backgroundColor: '#fff',

                },
                // tabBarIconStyle: {
                //     marginBottom: -40, // Điều chỉnh margin để đưa icon xuống giữa
                // },

            }}
        >
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Product"
                component={Product}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Sản Phẩm',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="local-mall" size={24} color={color} />),
                     
                }}
            />
            
            <Tab.Screen
                name="news"
                component={Blogs}
                options={{
                    tabBarLabel: 'Tin tức',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="news" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Tài khoản',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-reactivate-outline" size={20} color={color} />

                    ),
                }}
            />

            
        </Tab.Navigator>
    );
}