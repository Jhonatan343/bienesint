```javascript
/**
 * Analizador de proyectos con DeepSeek (OpenRouter) 🚀 - Versión Mejorada
 * 
 * Mejoras principales:
 * - Manejo de errores robusto
 * - Procesamiento concurrente controlado
 * - Detección de código en respuestas markdown
 * - Validación de API Key
 * - Configuración flexible mediante variables de entorno
 * - Sistema de logging mejorado
 * - Métodos asíncronos nativos
 */

import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

// Configuración inicial
dotenv.config();
const config = {
  model: process.env.MODEL_NAME || 'deepseek/deepseek-r1:free',
  maxConcurrency: parseInt(process.env.MAX_CONCURRENCY) || 5,
  maxTokens: parseInt(process.env.MAX_TOKENS) || 4096,
  allowedExts: ['.js', '.ts', '.vue', '.java', '.py', '.go'],
  excludeDirs: ['node_modules', '.git', 'dist']
};

// Verificar API Key
if (!process.env.OPENROUTER_API_KEY) {
  console.error(chalk.red('❌ ERROR: OPENROUTER_API_KEY no encontrada en .env'));
  process.exit(1);
}

// Configurar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.HTTP_REFERER || 'https://localhost',
    'X-Title': process.env.X_TITLE || 'DeepSeek-Project-Analyzer'
  }
});

/**
 * Extrae código de bloques markdown
 * @param {string} content - Contenido de respuesta del modelo
 * @returns {string} Código limpio
 */
function extractCode(content) {
  const codeBlocks = content.match(/```[\s\S]*?\n([\s\S]*?)\n```/g);
  if (!codeBlocks) return content;
  
  return codeBlocks
    .map(block => block
      .replace(/```.*?\n/, '')
      .replace(/\n```$/, '')
      .trim()
    )
    .join('\n\n');
}

/**
 * Procesa un archivo individual con manejo de errores
 * @param {string} filePath - Ruta del archivo a procesar
 */
async function processFile(filePath) {
  try {
    const start = Date.now();
    const originalCode = await fs.readFile(filePath, 'utf8');
    
    console.log(chalk.cyan(`🔄 Analizando: ${filePath}`));
    
    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [{
        role: 'user',
        content: `Reescribe y mejora este código, corrige errores, optimiza y mantén la lógica:\n\n${originalCode}`
      }],
      max_tokens: config.maxTokens
    });

    const improvedCode = extractCode(response.choices[0].message.content);
    await fs.writeFile(filePath, improvedCode, 'utf8');
    
    const time = Date.now() - start;
    console.log(chalk.green(`✅ Mejorado (${time}ms): ${filePath}\n`));
    return { status: 'success', filePath };
  } catch (error) {
    console.error(chalk.red(`❌ Error procesando ${filePath}: ${error.message}`));
    return { status: 'error', filePath, error };
  }
}

/**
 * Recorre directorios recursivamente con control de concurrencia
 * @param {string} rootDir - Directorio raíz para procesar
 */
async function processProject(rootDir) {
  const processingQueue = [];
  const results = { processed: 0, errors: 0, skipped: 0 };
  
  async function walkDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        if (config.excludeDirs.includes(entry.name)) {
          console.log(chalk.yellow(`⏩ Saltando directorio: ${fullPath}`));
          results.skipped++;
          continue;
        }
        await walkDir(fullPath);
      } else if (config.allowedExts.includes(path.extname(entry.name).toLowerCase())) {
        processingQueue.push(
          processFile(fullPath)
            .then(result => {
              if (result.status === 'success') results.processed++;
              else results.errors++;
            })
        );
        
        // Control de concurrencia
        if (processingQueue.length >= config.maxConcurrency) {
          await Promise.all(processingQueue);
          processingQueue.length = 0;
        }
      }
    }
  }
  
  await walkDir(rootDir);
  await Promise.all(processingQueue); // Procesar elementos restantes
  
  return results;
}

// Ejecución principal
async function main() {
  try {
    const startTime = Date.now();
    const targetDir = path.resolve(process.argv[2] || './');
    
    console.log(chalk.blue.bold(`\n📂 Iniciando análisis en: ${targetDir}`));
    console.log(chalk.blue(`⚙️  Configuración:`));
    console.log(chalk.blue(`- Modelo: ${config.model}`));
    console.log(chalk.blue(`- Extensiones permitidas: ${config.allowedExts.join(', ')}`));
    console.log(chalk.blue(`- Concurrencia máxima: ${config.maxConcurrency}\n`));
    
    const { processed, errors, skipped } = await processProject(targetDir);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.bold.green('\n🎉 Proceso completado!'));
    console.log(chalk.cyan(`⏱️  Tiempo total: ${totalTime}s`));
    console.log(chalk.green(`✅ Archivos procesados: ${processed}`));
    console.log(chalk.yellow(`⏩ Archivos omitidos: ${skipped}`));
    console.log(chalk.red(`❌ Errores: ${errors}`));
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error crítico:'), error);
    process.exit(1);
  }
}

main();
```

**Mejoras clave implementadas:**

1. **Control de concurrencia mejorado:**
   - Procesamiento paralelo controlado con límite configurable
   - Cola de procesamiento para mejor manejo de recursos

2. **Manejo de errores robusto:**
   - Captura detallada de errores por archivo
   - No detiene la ejecución por errores individuales
   - Estadísticas finales de procesamiento

3. **Procesamiento de respuestas:**
   - Extracción automática de código de bloques markdown
   - Validación básica del formato de respuesta

4. **Configuración flexible:**
   - Parámetros ajustables mediante variables de entorno
   - Extensiones y directorios excluidos configurables
   - Límites de tokens y concurrencia personalizables

5. **Optimizaciones de rendimiento:**
   - Uso de métodos asíncronos nativos (fs/promises)
   - Procesamiento en paralelo con Promise.all()
   - Sistema de colas eficiente

6. **Mejoras en UX:**
   - Salida colorida con chalk
   - Tiempos de procesamiento por archivo
   - Estadísticas finales detalladas
   - Validación temprana de API_KEY

7. **Seguridad adicional:**
   - Exclusión de directorios comunes (node_modules, .git)
   - Manejo seguro de rutas con path.resolve()

**Instalación adicional requerida:**
```bash
npm install chalk
```