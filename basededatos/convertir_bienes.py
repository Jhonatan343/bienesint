import re

codigos_insertados = set()

# Abre el archivo de origen y el de destino
with open('basededatos/DBbienes.sql', 'r', encoding='utf-8') as infile, open('basededatos/bienes_migrados.sql', 'w', encoding='utf-8') as outfile:
    for line in infile:
        # Extrae los valores del INSERT
        match = re.search(r"VALUES\s*\((.*)\);", line)
        if not match:
            continue
        values = match.group(1)
        # Quita las comillas y separa los campos
        campos = [v.strip().strip("'") for v in re.split(r",(?![^()]*\))", values)]
        # Asigna variables a cada campo según el orden de tu archivo
        bien = campos[0]
        codigo_institucional = campos[1]
        codigo_senescyt = campos[2]
        clase_de_bien = campos[3]
        modelo = campos[4]
        serie = campos[5]
        marca = campos[6]
        estado = campos[7]
        ubicacion = campos[8]
        responsable = campos[9]
        nro_acta_entrega = campos[10]
        observaciones = campos[11]
        nro_acta_constatacion = campos[12]
        valor = campos[13]
        color = campos[14]
        material = campos[15]

        # Evita duplicados de codigo_institucional
        if codigo_institucional in codigos_insertados:
            continue
        codigos_insertados.add(codigo_institucional)

        # Manejo especial para codigo_senescyt duplicado (asegura NULL sin comillas)
        if codigo_senescyt in ["N/A", "", "NULL"]:
            codigo_senescyt_sql = "NULL"
        else:
            codigo_senescyt_sql = f"'{codigo_senescyt}'"
        valor_sql = valor if valor not in ["N/A", "", "NULL"] else "NULL"

        # Genera los comandos SQL adaptados
        sql = f"""-- Migración de bien: {codigo_institucional}
INSERT IGNORE INTO ubicaciones (area) VALUES ('{ubicacion}');
INSERT IGNORE INTO usuarios (nombres, rol) VALUES ('{responsable}', 'custodio');
SET @id_ubicacion = (SELECT id_ubicacion FROM ubicaciones WHERE area = '{ubicacion}' LIMIT 1);
SET @id_usuario = (SELECT id_usuario FROM usuarios WHERE nombres = '{responsable}' LIMIT 1);
INSERT INTO bienes (
  bien, codigo_institucional, codigo_senescyt, clase_de_bien, modelo, serie, marca, estado, observaciones, nro_acta_entrega_recepcion, nro_acta_constatacion_fisica, valor, color, material, ubicacion, responsable_institucional
) VALUES (
  '{bien}', '{codigo_institucional}', {codigo_senescyt_sql}, '{clase_de_bien}', '{modelo}', '{serie}', '{marca}', '{estado}', '{observaciones}', '{nro_acta_entrega}', '{nro_acta_constatacion}', {valor_sql}, '{color}', '{material}', '{ubicacion}', '{responsable}'
);
SET @id_bien = LAST_INSERT_ID();
INSERT INTO bien_ubicacion (id_bien, id_ubicacion, activo) VALUES (@id_bien, @id_ubicacion, 1);
INSERT INTO bien_usuario (id_bien, id_usuario, activo) VALUES (@id_bien, @id_usuario, 1);

"""
        outfile.write(sql)

print("Conversión completada. Revisa el archivo basededatos/bienes_migrados.sql")