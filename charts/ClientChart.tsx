import { getClientSales } from "@/db/database";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { VictoryPie } from "victory-native";

function ClientChart({ clients }: any) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [clientSales, setClientSales] = useState<any[]>([]);

    useEffect(() => {
        if (clients.length > 0) {
            loadClients();
        } else {
            setChartData([]);
        }
    }, [clients]);

    const getClientSalesAsync = (clientId: any): Promise<any[]> => {
        return new Promise((resolve) => {
            getClientSales(clientId, (sales) => {
                resolve(sales);
            });
        });
    };

    const loadClients = async () => {
        const data: any[] = [];

        const getSales = (clientId: any) => {
            return new Promise<any[]>((resolve) => {
                getClientSales(clientId, (sales) => {
                    resolve(sales);
                });
            });
        };

        for (const client of clients) {
            const sales = await getSales(client.id);
            const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);
            if (totalAmount > 0) {
                data.push({ x: client.name, y: totalAmount });
            }
        }

        const topClients = data
            .sort((a, b) => b.y - a.y)
            .slice(0, 5);

        setChartData(topClients);
    };

    const handleSlicePress = async (datum: any) => {
        setSelectedClient(datum);
        const client = clients.find((c: any) => c.name === datum.x);
        if (client) {
            const sales = await getClientSalesAsync(client.id);
            setClientSales(sales);
        }
    };

    if (chartData.length === 0) {
        return (
            <Text style={{ textAlign: "center", fontSize: 18 }}>
                No Available Data
            </Text>
        );
    }

    return (
        <View style={{ margin: 16 }}>
            {selectedClient && (
                <View style={{
                    position: 'absolute',
                    top: 100,
                    left: 20,
                    right: 20,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    padding: 20,
                    elevation: 10,
                    zIndex: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                        Client Info
                    </Text>
                    <Text style={{ fontStyle: 'italic', textTransform: 'capitalize' }}>Name: {selectedClient.x}</Text>
                    <Text>Total Sales: ${selectedClient.y}</Text>

                    <Text style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4 }}>
                        Sales List:
                    </Text>

                    <View style={{ maxHeight: 250 }}>
                        <ScrollView>
                            {clientSales.length === 0 ? (
                                <Text style={{ fontStyle: 'italic' }}>No sales data</Text>
                            ) : (
                                clientSales.map((sale, index) => (
                                    <View key={index} style={{
                                        paddingVertical: 8,
                                        borderBottomWidth: 0.5,
                                        borderColor: '#ccc'
                                    }}>
                                        <Text style={{ fontSize: 14 }}>Date: {sale.date}</Text>
                                        <Text style={{ fontSize: 14 }}>Amount: ${sale.amount}</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>

                    <Text
                        onPress={() => {
                            setSelectedClient(null);
                            setClientSales([]);
                        }}
                        style={{
                            marginTop: 16,
                            color: 'blue',
                            textAlign: 'right',
                            fontWeight: 'bold'
                        }}
                    >
                        Close
                    </Text>
                </View>
            )}

            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
                Sales Distribution by Client
            </Text>

            <VictoryPie
                data={chartData}
                colorScale="qualitative"
                labels={({ datum }) => `${datum.x}: $${datum.y}`}
                style={{ labels: { fontSize: 12, padding: 10 } }}
                width={350}
                height={350}
                events={[
                    {
                        target: "data",
                        eventHandlers: {
                            onPressIn: (evt, props) => {
                                const clickedDatum = props.datum;
                                handleSlicePress(clickedDatum);
                                return [];
                            },
                        },
                    },
                ]}
            />
        </View>
    );
}

export default ClientChart;
