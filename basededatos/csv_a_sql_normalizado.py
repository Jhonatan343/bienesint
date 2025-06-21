import pandas as pd
import unicodedata

def normalizar_columna(nombre):
    nombre = str(nombre)
    nombre = unicodedata.normalize('NFKD', nombre).encode('ASCII', 'ignore').decode('utf-8')
    return nombre.strip().replace(' ', '').replace('.', '').replace('_', '').upper()

# Configuración de archivos
archivo_csv = 'MATRIZ BIENES.csv'
archivo_sql = 'bienes_migracion_normalizada.sql'

# Leer CSV (separador ; y sin inferir tipo)
df = pd.read_csv(archivo_csv, sep=';', dtype=str).fillna('')
df.columns = [normalizar_columna(col) for col in df.columns]

# Mapear columnas del CSV a la estructura de la base
usuarios = {}
ubicaciones = {}
inserts_usuarios = []
inserts_ubicaciones = []
inserts_bienes = []
inserts_bien_usuario = []
inserts_bien_ubicacion = []
usuario_id_seq = 1
ubicacion_id_seq = 1
bien_id_seq = 1
codigos_institucionales_vistos = set()
codigos_senescyt_vistos = set()

for idx, row in df.iterrows():
    # --- USUARIO ---
    responsable = row.get('RESPONSABLEINSTITUCIONAL', '').strip()
    if responsable == '':
        responsable = 'usuario_desconocido'
    if responsable not in usuarios:
        usuarios[responsable] = usuario_id_seq
        # Cedula única ficticia por usuario
        cedula_ficticia = f"0000000{usuario_id_seq:03d}"
        inserts_usuarios.append(f"INSERT INTO usuarios (id_usuario, nombres, apellidos, cedula, rol, activo) VALUES ({usuario_id_seq}, '{responsable.replace("'", "''")}', '', '{cedula_ficticia}', 'usuario', 1);")
        usuario_id_seq += 1
    usuario_id = usuarios[responsable]

    # --- UBICACION ---
    ubicacion = row.get('UBICACION', '').strip()
    if ubicacion == '':
        ubicacion = 'UBICACION_DESCONOCIDA'
    if ubicacion not in ubicaciones:
        ubicaciones[ubicacion] = ubicacion_id_seq
        # Solo área, el resto por defecto
        inserts_ubicaciones.append(f"INSERT INTO ubicaciones (id_ubicacion, area, numero_aula, piso, sede, descripcion, activo) VALUES ({ubicacion_id_seq}, '{ubicacion.replace("'", "''")}', '', '', 'Sede Principal', '', 1);")
        ubicacion_id_seq += 1
    ubicacion_id = ubicaciones[ubicacion]

    # --- BIEN ---
    bien = row.get('BIEN', '')
    codigo_institucional = row.get('CODIGOINSTITUCIONAL', '')
    # Si el código ya fue usado, genera uno alternativo único
    if codigo_institucional and codigo_institucional in codigos_institucionales_vistos:
        codigo_institucional_insert = f"DUPLICADO-{bien_id_seq}"
    elif codigo_institucional.strip() == '':
        codigo_institucional_insert = f"SIN-CODIGO-{bien_id_seq}"
    else:
        codigo_institucional_insert = codigo_institucional
        codigos_institucionales_vistos.add(codigo_institucional)
    # Escapar comillas simples en el valor
    codigo_institucional_insert = codigo_institucional_insert.replace("'", "''")
    codigo_senescyt = row.get('CODIGOSENESCYT', '')
    if codigo_senescyt.strip() == '' or codigo_senescyt.strip().upper() == 'N/A':
        codigo_senescyt_sql = 'NULL'
    elif codigo_senescyt in codigos_senescyt_vistos:
        codigo_senescyt_sql = 'NULL'
    else:
        codigo_senescyt_sql = f"'{codigo_senescyt}'"
        codigos_senescyt_vistos.add(codigo_senescyt)
    clase_de_bien = row.get('CLASEDEBIEN', '')
    modelo = row.get('MODELO', '')
    serie = row.get('SERIE', '')
    marca = row.get('MARCA', '')
    estado = row.get('ESTADO', '')
    observaciones = row.get('OBSERVACIONES', '')
    nro_acta_entrega = row.get('NRODEACTAENTREGADE RECEPCION', '')
    nro_acta_constatacion = row.get('NRODEACTADECONSTATACIONFISICA', '')
    valor = row.get('VALOR', '')
    color = row.get('COLOR', '')
    material = row.get('MATERIAL', '')
    inserts_bienes.append(
        f"INSERT INTO bienes (id_bien, codigo_institucional, codigo_senescyt, clase_de_bien, modelo, serie, marca, estado, observaciones, nro_acta_entrega_recepcion, nro_acta_constatacion_fisica, valor, bien, ubicacion, responsable_institucional, color, material) VALUES ("
        f"{bien_id_seq}, '{codigo_institucional_insert}', {codigo_senescyt_sql}, '{clase_de_bien}', '{modelo}', '{serie}', '{marca}', '{estado}', '{observaciones}', '{nro_acta_entrega}', '{nro_acta_constatacion}', '{valor}', '{bien}', '{ubicacion}', '{responsable}', '{color}', '{material}');"
    )
    # --- RELACIONES ---
    inserts_bien_usuario.append(f"INSERT INTO bien_usuario (id_bien, id_usuario, activo) VALUES ({bien_id_seq}, {usuario_id}, 1);")
    inserts_bien_ubicacion.append(f"INSERT INTO bien_ubicacion (id_bien, id_ubicacion, activo) VALUES ({bien_id_seq}, {ubicacion_id}, 1);")
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
    f.write('-- Relación bien-ubicacion\n')
    f.write('\n'.join(inserts_bien_ubicacion) + '\n\n')
    f.write(f'-- Resumen: Total bienes: {bien_id_seq-1}, usuarios: {len(usuarios)}, ubicaciones: {len(ubicaciones)}\n')

print(f'Archivo SQL generado: {archivo_sql}')
print(f'Total bienes: {bien_id_seq-1}, usuarios: {len(usuarios)}, ubicaciones: {len(ubicaciones)}')
