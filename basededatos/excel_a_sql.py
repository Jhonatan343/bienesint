import pandas as pd
import os
import unicodedata
import difflib

def normalizar_columna(nombre):
    nombre = str(nombre)
    nombre = unicodedata.normalize('NFKD', nombre).encode('ASCII', 'ignore').decode('utf-8')
    return nombre.strip().replace(' ', '').replace('.', '').replace('_', '').upper()

def buscar_fila_encabezado_flexible(df, variantes):
    for i, row in df.iterrows():
        row_norm = [normalizar_columna(str(x)) for x in row.values]
        for variante in variantes:
            matches = difflib.get_close_matches(variante, row_norm, n=1, cutoff=0.8)
            if matches:
                return i, row_norm
    return None, None

# Columnas clave esperadas y sus variantes
columnas_clave = [
    'BIEN', 'CÓDIGO INSTITUCIONAL', 'CÓDIGO SENESCYT', 'CLASE DE BIEN', 'MODELO', 'SERIE', 'MARCA', 'ESTADO',
    'UBICACIÓN', 'RESPONSABLE INSTITUCIONAL', 'NRO. DE ACTA ENTREGA DE RECEPCION', 'OBSERVACIONES',
    'NRO. DE ACTA DE CONSTATACIÓN FÍSICA', 'VALOR', 'COLOR', 'MATERIAL'
]

# Variantes para buscar encabezados flexibles
variantes_codigo = [
    'CODIGOINSTITUCIONAL', 'CODIGO INSTITUCIONAL', 'COD. INSTITUCIONAL', 'CÓDIGO INSTITUCIONAL', 'CODIGO', 'CODIGO BIEN', 'CODIGO BIEN INSTITUCIONAL'
]

archivo_excel = 'MATRIZ BIENES.xlsx'
archivo_sql = 'bienes_migracion_datos.sql'
usuario_generico = 'usuario_desconocido'

conteo_bienes = 0
conteo_usuarios = set()
conteo_ubicaciones = set()

# Contadores globales
filas_totales_leidas = 0
filas_totales_omitidas = 0

# Leer todas las hojas
bienes_extraidos = 0
df_total = []
resumen_hojas = []
filas_omitidas_por_hoja = {}
codigos_omitidos_por_hoja = {}
with pd.ExcelFile(archivo_excel) as xls:
    for hoja in xls.sheet_names:
        try:
            df_raw = pd.read_excel(xls, sheet_name=hoja, header=None)
            filas_totales_leidas += len(df_raw)
            idx_header, row_norm = buscar_fila_encabezado_flexible(df_raw, variantes_codigo)
            if idx_header is not None:
                df = pd.read_excel(xls, sheet_name=hoja, header=idx_header)
                df['__hoja__'] = hoja
                # Eliminar columnas Unnamed
                df = df.loc[:, ~df.columns.str.contains('^Unnamed', case=False)]
                filas_antes = len(df)
                # Detectar columna de código institucional en esta hoja
                dict_cols_hoja = {normalizar_columna(col): col for col in df.columns}
                col_codigo_hoja = None
                for variante in variantes_codigo:
                    key = normalizar_columna(variante)
                    if key in dict_cols_hoja:
                        col_codigo_hoja = dict_cols_hoja[key]
                        break
                codigos_omitidos = []
                if col_codigo_hoja:
                    df_filtrada = df.dropna(subset=[col_codigo_hoja])
                    omitidas = df[~df.index.isin(df_filtrada.index)]
                    for _, row in omitidas.iterrows():
                        codigos_omitidos.append(str(row.get(col_codigo_hoja, 'VACIO')))
                    filas_omitidas = len(omitidas)
                    filas_validas = len(df_filtrada)
                    df_total.append(df_filtrada)
                else:
                    filas_omitidas = len(df)
                    filas_validas = 0
                    codigos_omitidos = ['NO SE ENCONTRÓ COLUMNA DE CÓDIGO'] * len(df)
                resumen_hojas.append({'hoja': hoja, 'filas': filas_validas, 'omitidas': filas_omitidas})
                filas_omitidas_por_hoja[hoja] = filas_omitidas
                codigos_omitidos_por_hoja[hoja] = codigos_omitidos
                filas_totales_omitidas += filas_omitidas
                print(f"Hoja '{hoja}' procesada: {filas_validas} filas, omitidas: {filas_omitidas}.")
            else:
                resumen_hojas.append({'hoja': hoja, 'filas': 0, 'omitidas': 0})
                filas_omitidas_por_hoja[hoja] = 0
                codigos_omitidos_por_hoja[hoja] = ['NO SE ENCONTRÓ ENCABEZADO']
                print(f"Hoja '{hoja}' omitida: no se encontró encabezado.")
        except Exception as e:
            resumen_hojas.append({'hoja': hoja, 'filas': 0, 'omitidas': 0})
            filas_omitidas_por_hoja[hoja] = 0
            codigos_omitidos_por_hoja[hoja] = [f'ERROR: {e}']
            print(f"Hoja '{hoja}' omitida: {e}")

if not df_total:
    print('No se encontraron hojas con bienes.')
    exit(1)

df = pd.concat(df_total, ignore_index=True)

# Normalizar encabezados
dict_cols = {normalizar_columna(col): col for col in df.columns}

# Función para obtener el valor de una columna por nombre lógico (flexible)
def get_val(row, nombre):
    key = normalizar_columna(nombre)
    col = dict_cols.get(key)
    if col is None:
        # Buscar por similitud si no está
        for k, v in dict_cols.items():
            if difflib.SequenceMatcher(None, k, key).ratio() > 0.8:
                return row[v] if not pd.isna(row[v]) else ''
        return ''
    return row[col] if not pd.isna(row[col]) else ''

# Limpiar datos: eliminar filas vacías o sin código institucional
col_codigo = None
for variante in variantes_codigo:
    key = normalizar_columna(variante)
    if key in dict_cols:
        col_codigo = dict_cols[key]
        break
if not col_codigo:
    print('No se encontró ninguna columna de código institucional en los datos combinados.')
    exit(1)

filas_antes = len(df)
df = df.dropna(subset=[col_codigo])
filas_despues = len(df)
filas_omitidas = filas_antes - filas_despues

usuarios = set()
ubicaciones = set()
# bienes = set()  # Ya no se usará para evitar duplicados
# bienes_sin_codigo = set()  # Ya no se usará para evitar duplicados

inserts_usuarios = []
inserts_ubicaciones = []
inserts_bienes = []
inserts_bien_usuario = []

usuario_id_map = {}
ubicacion_id_map = {}
# bien_id_map = {}  # Ya no se usará para evitar duplicados

usuario_id_seq = 1
ubicacion_id_seq = 1
bien_id_seq = 1

usuarios.add(usuario_generico)
usuario_id_map[usuario_generico] = usuario_id_seq
inserts_usuarios.append(f"INSERT INTO usuarios (id_usuario, nombre) VALUES ({usuario_id_seq}, '{usuario_generico}');")
usuario_id_seq += 1

# Resumen por hoja
conteo_por_hoja = {h['hoja']: 0 for h in resumen_hojas}
conteo_por_hoja_sin_codigo = {h['hoja']: 0 for h in resumen_hojas}

for idx, row in df.iterrows():
    hoja_origen = row['__hoja__'] if '__hoja__' in row else ''
    responsable = str(get_val(row, 'RESPONSABLE INSTITUCIONAL')).strip()
    if not responsable or responsable.lower() in ['nan', 'none', '']:
        responsable = usuario_generico
    if responsable not in usuarios:
        usuarios.add(responsable)
        usuario_id_map[responsable] = usuario_id_seq
        inserts_usuarios.append(f"INSERT INTO usuarios (id_usuario, nombre) VALUES ({usuario_id_seq}, '{responsable.replace("'", "''")}');")
        usuario_id_seq += 1
    conteo_usuarios.add(responsable)

    ubicacion = str(get_val(row, 'UBICACIÓN')).strip()
    if not ubicacion or ubicacion.lower() in ['nan', 'none', '']:
        ubicacion = 'UBICACION_DESCONOCIDA'
    if ubicacion not in ubicaciones:
        ubicaciones.add(ubicacion)
        ubicacion_id_map[ubicacion] = ubicacion_id_seq
        inserts_ubicaciones.append(f"INSERT INTO ubicaciones (id_ubicacion, nombre) VALUES ({ubicacion_id_seq}, '{ubicacion.replace("'", "''")}');")
        ubicacion_id_seq += 1
    conteo_ubicaciones.add(ubicacion)

    # Extraer todos los campos clave, rellenar con vacío si falta
    campos = {}
    for col in columnas_clave:
        campos[col] = get_val(row, col)
    codigo_institucional = str(campos['CÓDIGO INSTITUCIONAL']).strip()
    codigo_senescyt_sql = 'NULL' if not campos['CÓDIGO SENESCYT'] or str(campos['CÓDIGO SENESCYT']).lower() in ['nan', 'none', 'null', ''] else f"'{campos['CÓDIGO SENESCYT']}'"
    valor_sql = 'NULL' if not campos['VALOR'] or str(campos['VALOR']).lower() in ['nan', 'none', 'null', ''] else f"'{campos['VALOR']}'"
    # Insertar siempre, sin filtrar duplicados
    inserts_bienes.append(
        f"-- Hoja: {hoja_origen}\n"
        f"INSERT INTO bienes (id_bien, codigo_institucional, codigo_senescyt, bien, clase, modelo, serie, marca, estado, valor, color, material) VALUES ("
        f"{bien_id_seq}, '{codigo_institucional if codigo_institucional else ''}', {codigo_senescyt_sql}, "
        f"'{campos['BIEN']}', '{campos['CLASE DE BIEN']}', '{campos['MODELO']}', '{campos['SERIE']}', '{campos['MARCA']}', '{campos['ESTADO']}', {valor_sql}, '{campos['COLOR']}', '{campos['MATERIAL']}');"
    )
    conteo_por_hoja[hoja_origen] += 1
    id_bien = bien_id_seq
    bien_id_seq += 1
    bienes_extraidos += 1
    id_usuario = usuario_id_map[responsable]
    inserts_bien_usuario.append(f"INSERT INTO bien_usuario (id_bien, id_usuario, activo) VALUES ({id_bien}, {id_usuario}, 1);")

with open(archivo_sql, 'w', encoding='utf-8') as f:
    f.write('-- Usuarios\n')
    f.write('\n'.join(inserts_usuarios) + '\n\n')
    f.write('-- Ubicaciones\n')
    f.write('\n'.join(inserts_ubicaciones) + '\n\n')
    f.write('-- Bienes\n')
    f.write('\n'.join(inserts_bienes) + '\n\n')
    f.write('-- Relación bien-usuario\n')
    f.write('\n'.join(inserts_bien_usuario) + '\n\n')
    f.write(f'-- Resumen global: Filas totales leídas: {filas_totales_leidas}, bienes extraídos: {bienes_extraidos}, filas omitidas: {filas_totales_omitidas}\n')
    f.write('-- Resumen por hoja:\n')
    for hoja in conteo_por_hoja:
        f.write(f'--   Hoja: {hoja} - bienes con código: {conteo_por_hoja[hoja]}, bienes sin código: {conteo_por_hoja_sin_codigo[hoja]}, filas omitidas: {filas_omitidas_por_hoja.get(hoja, 0)}\n')
        if filas_omitidas_por_hoja.get(hoja, 0) > 0:
            f.write(f'--     Códigos omitidos: {codigos_omitidos_por_hoja.get(hoja, [])[:10]}\n')

print(f'Archivo SQL generado: {archivo_sql}')
print(f'Filas totales leídas: {filas_totales_leidas}, bienes extraídos: {bienes_extraidos}, filas omitidas: {filas_totales_omitidas}')
print(f'Total bienes: {bienes_extraidos}, usuarios únicos: {len(conteo_usuarios)}, ubicaciones únicas: {len(conteo_ubicaciones)}')
print('Resumen por hoja:')
for hoja in conteo_por_hoja:
    print(f'  Hoja: {hoja} - bienes con código: {conteo_por_hoja[hoja]}, bienes sin código: {conteo_por_hoja_sin_codigo[hoja]}, filas omitidas: {filas_omitidas_por_hoja.get(hoja, 0)}')
    if filas_omitidas_por_hoja.get(hoja, 0) > 0:
        print(f'    Códigos omitidos (máx 10): {codigos_omitidos_por_hoja.get(hoja, [])[:10]}')
