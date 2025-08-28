import { getClientSales } from "@/db/database";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { VictoryPie } from "victory-native";

function ClientChart({ clients }: any) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);

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
    if (chartData.length === 0) {
        return (
            <Text style={{ textAlign: "center", fontSize: 18 }}>
                No Available Data
            </Text>
        );
    }
    const handleSlicePress = (datum: any) => {
        console.log("Cliecked:", datum.x);
        setSelectedClient(datum);


    };

    return (
        <View style={{ margin: 16 }}>
            {selectedClient && (
                <View style={{
                    position: 'absolute',
                    top: 100,
                    left: 40,
                    right: 40,
                    padding: 20,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    elevation: 10,
                    shadowOffset: { width: 0, height: 2 },
                    zIndex: 10
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                        Client Info
                    </Text>
                    <Text>Name: {selectedClient.x}</Text>
                    <Text>Total Sales: ${selectedClient.y}</Text>
                    <Text onPress={() => setSelectedClient(null)} style={{ marginTop: 12, color: 'blue' }}>
                        Close
                    </Text>
                </View>
            )}
            <Text style={{ fontWeight: "bold", marginBottom: 12 }}>
                Sales distribution By Client
            </Text>
            <VictoryPie
                data={chartData}
                colorScale="qualitative"
                labels={({ datum }) => `${datum.x}: ${datum.y}`}
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
