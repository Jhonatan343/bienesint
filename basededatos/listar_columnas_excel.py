import pandas as pd

# Ruta al archivo Excel
archivo_excel = 'MATRIZ BIENES.xlsx'

# Listar las hojas disponibles
def listar_hojas():
    xls = pd.ExcelFile(archivo_excel)
    print('Hojas encontradas en el archivo Excel:')
    for hoja in xls.sheet_names:
        print(f'- {hoja}')
    return xls.sheet_names

# Mostrar las primeras filas de una hoja específica
def mostrar_filas(hoja):
    df = pd.read_excel(archivo_excel, sheet_name=hoja, header=None)
    print(f'Primeras 5 filas de la hoja "{hoja}":')
    print(df.head())

# Leer la hoja CONSULTA usando la fila 4 como encabezado (header=4)
def mostrar_columnas_consulta():
    df = pd.read_excel(archivo_excel, sheet_name='CONSULTA', header=4)
    print('Columnas detectadas en la hoja CONSULTA:')
    for col in df.columns:
        print(f'- {col}')
    print('\nPrimeras 5 filas de datos:')
    print(df.head())

def main():
    hojas = listar_hojas()
    print('\n')
    # Por defecto, mostrar la primera hoja
    mostrar_filas(hojas[0])
    print('\n')
    mostrar_columnas_consulta()

if __name__ == '__main__':
    main()
