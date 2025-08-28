import { storageToken } from "@/utils/auth"
import { useState } from "react"
import { Alert, Button, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { FontAwesome, Ionicons } from '@expo/vector-icons'
function LoginScreen({ navigation }: any) {
    const [username, setUsername] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [showPassword, setShowPassword] = useState<boolean>(false)


    const handleLogin = async () => {
        if (username === 'admin' && password === 'admin') {
            await storageToken('demo-token')
            navigation.replace('Home')
        }
        else {
            Alert.alert('Invalid Login')
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.subContiner}>
                <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            </View>
            <View style={styles.subContiner}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                    <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={22} color='gray' />
                </TouchableOpacity>
            </View>

            <Button title='Login' onPress={handleLogin}></Button>
        </View>
    )
}

export default LoginScreen


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10
    },
    subContiner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 5
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 0,
        userSelect: 'none'
    },
    icon: {
        padding: 5
    }
})