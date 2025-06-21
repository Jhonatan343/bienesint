import pandas as pd
import unicodedata
import os

def normalizar_columna(nombre):
    nombre = str(nombre)
    nombre = unicodedata.normalize('NFKD', nombre).encode('ASCII', 'ignore').decode('utf-8')
    return nombre.strip().replace(' ', '').replace('.', '').replace('_', '').upper()

# Configuración de archivos
archivo_csv = 'MATRIZ BIENES.csv'
archivo_sql = 'bienes_migracion_datos_csv.sql'
usuario_generico = 'usuario_desconocido'

# Leer CSV
print('Leyendo CSV...')
df = pd.read_csv(archivo_csv, dtype=str).fillna('')

# Normalizar encabezados
df.columns = [normalizar_columna(col) for col in df.columns]

# Columnas clave esperadas (ajustar según el CSV real)
columnas_clave = [
    'BIEN', 'CODIGOINSTITUCIONAL', 'CODIGOSENESCYT', 'CLASEDEBIEN', 'MODELO', 'SERIE', 'MARCA', 'ESTADO',
    'UBICACION', 'RESPONSABLEINSTITUCIONAL', 'NRODEACTAENTREGADE RECEPCION', 'OBSERVACIONES',
    'NRODEACTADECONSTATACIONFISICA', 'VALOR', 'COLOR', 'MATERIAL'
]

usuarios = set()
ubicaciones = set()
inserts_usuarios = []
inserts_ubicaciones = []
inserts_bienes = []
inserts_bien_usuario = []
usuario_id_map = {}
ubicacion_id_map = {}
usuario_id_seq = 1
ubicacion_id_seq = 1
bien_id_seq = 1

usuarios.add(usuario_generico)
usuario_id_map[usuario_generico] = usuario_id_seq
inserts_usuarios.append(f"INSERT INTO usuarios (id_usuario, nombre) VALUES ({usuario_id_seq}, '{usuario_generico}');")
usuario_id_seq += 1

for idx, row in df.iterrows():
    responsable = row.get('RESPONSABLEINSTITUCIONAL', '').strip() or usuario_generico
    if responsable not in usuarios:
        usuarios.add(responsable)
        usuario_id_map[responsable] = usuario_id_seq
        inserts_usuarios.append(f"INSERT INTO usuarios (id_usuario, nombre) VALUES ({usuario_id_seq}, '{responsable.replace("'", "''")}');")
        usuario_id_seq += 1
    ubicacion = row.get('UBICACION', '').strip() or 'UBICACION_DESCONOCIDA'
    if ubicacion not in ubicaciones:
        ubicaciones.add(ubicacion)
        ubicacion_id_map[ubicacion] = ubicacion_id_seq
        inserts_ubicaciones.append(f"INSERT INTO ubicaciones (id_ubicacion, nombre) VALUES ({ubicacion_id_seq}, '{ubicacion.replace("'", "''")}');")
        ubicacion_id_seq += 1
    campos = {col: row.get(col, '') for col in columnas_clave}
    codigo_institucional = campos['CODIGOINSTITUCIONAL']
    codigo_senescyt_sql = 'NULL' if not campos['CODIGOSENESCYT'] else f"'{campos['CODIGOSENESCYT']}'"
    valor_sql = 'NULL' if not campos['VALOR'] else f"'{campos['VALOR']}'"
    inserts_bienes.append(
        f"INSERT INTO bienes (id_bien, codigo_institucional, codigo_senescyt, bien, clase, modelo, serie, marca, estado, valor, color, material) VALUES ("
        f"{bien_id_seq}, '{codigo_institucional}', {codigo_senescyt_sql}, "
        f"'{campos['BIEN']}', '{campos['CLASEDEBIEN']}', '{campos['MODELO']}', '{campos['SERIE']}', '{campos['MARCA']}', '{campos['ESTADO']}', {valor_sql}, '{campos['COLOR']}', '{campos['MATERIAL']}');"
    )
    id_usuario = usuario_id_map[responsable]
    inserts_bien_usuario.append(f"INSERT INTO bien_usuario (id_bien, id_usuario, activo) VALUES ({bien_id_seq}, {id_usuario}, 1);")
    bien_id_seq += 1

with open(archivo_sql, 'w', encoding='utf-8') as f:
    f.write('-- Usuarios\n')
    f.write('\n'.join(inserts_usuarios) + '\n\n')
    f.write('-- Ubicaciones\n')
    f.write('\n'.join(inserts_ubicaciones) + '\n\n')
    f.write('-- Bienes\n')
    f.write('\n'.join(inserts_bienes) + '\n\n')
    f.write('-- Relación bien-usuario\n')
    f.write('\n'.join(inserts_bien_usuario) + '\n\n')
    f.write(f'-- Resumen: Total bienes extraídos: {bien_id_seq-1}, usuarios únicos: {len(usuarios)}, ubicaciones únicas: {len(ubicaciones)}\n')

print(f'Archivo SQL generado: {archivo_sql}')
print(f'Total bienes: {bien_id_seq-1}, usuarios únicos: {len(usuarios)}, ubicaciones únicas: {len(ubicaciones)}')
