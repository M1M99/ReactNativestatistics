import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('bizman2.db');

        await db.execAsync(`
                CREATE TABLE IF NOT EXISTS clients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    phone TEXT,
                    email TEXT
                )
            `);

        await db.execAsync(`
                CREATE TABLE IF NOT EXISTS sales (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_id INTEGER NOT NULL ,
                    amount REAL NOT NULL,
                    date TEXT NOT NULL,
                    FOREIGN KEY (client_id) REFERENCES clients(id)
                )
            `);
    }
};

export const insertSale=async (clientId:number,amount:number,date:string)=>{
    await db?.execAsync(`
        INSERT INTO sales (client_id,amount,date)
        VALUES ('${clientId}','${amount}','${date}')
        `);
};

export const getClientSales=async (clientId:number,callback:(rows:any[])=>void)=>{
    const result=await db?.getAllAsync('SELECT * FROM sales WHERE client_id = ? ORDER BY date DESC',[clientId]);
    callback(result || []);
}

export const insertClient = async (name: string, phone: string, email: string, callback: () => void) => {
    await db?.execAsync(`
            INSERT INTO clients (name,phone,email)
            VALUES ("${name}","${phone}","${email}")
        `);
    callback();
};

export const getClients = async (callback: (rows: any[]) => void) => {
    const result = await db?.getAllAsync('SELECT * FROM clients');
    callback(result || []);
};

export const updateClient = async (id: number, name: string, phone: string, email: string) => {
    await db?.runAsync(`UPDATE clients SET name = ?, phone = ?,email = ? WHERE id = ?`, [name, phone, email, id]);
}

export const deleteClient = async (id: number) => {
    await db?.runAsync(`DELETE FROM clients WHERE id = ?`, [id]);
}