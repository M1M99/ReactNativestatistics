import { getToken } from '@/utils/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AddSaleScreen from '../screens/AddSaleScreen';
import ClientDetails from '../screens/ClientDetailsScreen';
import ClientScreen from '../screens/ClientScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLogin = async () => {
            const token = await getToken();
            setIsLoggedIn(!!token);
        };
        checkLogin();
    }, []);

    if (isLoggedIn === null) {
        return null;
    }

    return (
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name='Clients' component={ClientScreen}></Stack.Screen>
            <Stack.Screen name='ClientDetails' component={ClientDetails}></Stack.Screen>
            <Stack.Screen name='AddSale' component={AddSaleScreen }></Stack.Screen>
        </Stack.Navigator>
    );
}

export default AppNavigator;
