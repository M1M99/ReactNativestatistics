import { getClientSales } from "@/db/database";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';


function ClientSalesChart({ clientId }: any) {
    const [sales, setSalesData] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            await getClientSales(clientId, (sales => {
                const data = sales.map((s, index) => ({
                    x: s.date.slice(5),
                    y: s.amount
                }))
                setSalesData(data)
            }))
        }

        fetch()
    }, [clientId])

    if (sales.length === 0) {
        return (
            <ActivityIndicator />
        )
    }
    return (
        <View style={{ marginVertical: 12 }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                Sales trend
            </Text>
            <VictoryChart theme={VictoryTheme.clean} colorScale='red' domainPadding={18}>
                <VictoryBar colorScale='red' data={sales} />
            </VictoryChart>
        </View>
    )
}

export default ClientSalesChart
