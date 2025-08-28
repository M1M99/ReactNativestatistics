import ClientSalesChart from "@/charts/ClientSalesChart"; // fix typo if needed
import { getClientSales } from "@/db/database";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function ClientDetails({ route }: any) {
    const navigation: any = useNavigation();
    const { client } = route.params;
    const [sales, setSales] = useState<any[]>([]);

    const loadClient = () => {
        getClientSales(client.id, (data: any[]) => {
            setSales(data);
        });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadClient();
        });
        return unsubscribe;
    }, [navigation, client.id]);

    return (
        <SafeAreaView style={{ padding: 16, flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Name: {client.name}</Text>
            <Text>Phone: {client.phone}</Text>
            <Text>Email: {client.email}</Text>
            <ClientSalesChart clientId={client.id} />
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>Sales</Text>
            <ScrollView >
                {sales.map((sale) => (
                    <View key={sale.id} style={{ marginVertical: 8, padding: 8, backgroundColor: '#eee' }}>
                        <Text>Amount: {sale.amount}</Text>
                        <Text>Date: {sale.date}</Text>
                    </View>
                ))}
            </ScrollView>

            <Button
                mode="contained"
                style={{ marginVertical: 12 }}
                onPress={() => navigation.navigate('AddSale', { client })}
            >
                Add Sale
            </Button>
        </SafeAreaView>
    );
}
