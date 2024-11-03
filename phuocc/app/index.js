import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MyTab from './Screen/MyTab';
import Login from './Screen/compoment/Auth/Login';
import ProductDetail from './Screen/compoment/ProductDetail/ProductDetail';
import ProductsByCategory from './Screen/compoment/Category/ProductsByCategory';
import PostsByTopic from './Screen/compoment/PostsByTopic/PostsByTopic';
import Register from './Screen/compoment/Auth/register';
import Cart from './Screen/compoment/Cart/Cart';
import Contacts from './Screen/compoment/Contacts/Contacts';
import ProductNews from './Screen/compoment/Product/ProductNew';
import ProductBestSellers from './Screen/compoment/Product/ProductBestSellers';
import ProductSale from './Screen/compoment/Product/ProductSale';
import Checkout from './Screen/compoment/Order/Checkout';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Login">
                {/* Login Screen */}
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                {/* Home Screen */}
                <Stack.Screen
                    name="Home"
                    component={MyTab}
                    options={{
                        headerShown: false,
                        title: 'Home Page',
                        headerStyle: {
                            backgroundColor: '#f4511e',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                {/* Product Detail Screen */}
                <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetail}
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="ProductsByCategory"
                    component={ProductsByCategory}
                    options={{
                        headerShown: false,
                    }}
                />
                     <Stack.Screen
                    name="PostsByTopic"
                    component={PostsByTopic}
                    options={{
                        headerShown: false,
                    }}
                />
                  <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{
                        headerShown: false,
                    }}
                />
                       <Stack.Screen
                    name="Cart"
                    component={Cart}
                    options={{
                        headerShown: false,
                    }}
                />
                           <Stack.Screen
                    name="Contacts"
                    component={Contacts}
                    options={{
                        headerShown: false,
                    }}
                />
                
                <Stack.Screen
                    name="AllNewProducts"
                    component={ProductNews}
                    options={{
                        headerShown: false,
                    }}
                />
                 <Stack.Screen
                    name="AllSaleProducts"
                    component={ProductSale}
                    options={{
                        headerShown: false,
                    }}
                />
                 <Stack.Screen
                    name="AllBestSellers"
                    component={ProductBestSellers}
                    options={{
                        headerShown: false,
                    }}
                />
                 <Stack.Screen
                    name="Checkout"
                    component={Checkout}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
