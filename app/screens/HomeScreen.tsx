import ClientChart from "@/charts/ClientChart";
import { getClients, initDatabase } from "@/db/database";
import { removeToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function HomeScreen({ navigation }: any) {
    const [clients, setClients] = useState<any[]>([])
    const logout = async () => {
        await removeToken();
        navigation.replace('Login')
    };
    useEffect(() => {
        (async () => {
            await initDatabase();
            await loadClients()
        })()
    }, [])
    const loadClients = async () => {
        await getClients((data) => {
            setClients(data)
        })
    }


    const clientsData = clients ?? []

    return (
        <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                Welcome To Bizman
            </Text>
            <ClientChart clients={clientsData} />
            <Button title="Go Clients" onPress={() => navigation.navigate('Clients')} />
            <Button title="Logout" onPress={logout} />
        </View>

    )
}