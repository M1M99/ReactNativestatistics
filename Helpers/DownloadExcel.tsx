import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

export const writeAndDownloadExcel = async (data: any[]) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales');

  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: 'xlsx',
  });

  const fileUri = FileSystem.documentDirectory + 'client_sales.xlsx';

  await FileSystem.writeAsStringAsync(fileUri, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(fileUri, {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Share Excel file',
    UTI: 'com.microsoft.excel.xlsx',
  });

  return fileUri;
};
