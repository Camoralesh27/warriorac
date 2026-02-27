// gulpfile.js (ESM)

// --- Módulos de Node ---
import path from 'path';
import fs from 'fs';

// --- Dependencias externas ---
import { glob } from 'glob';
import sharp from 'sharp';

// --- Gulp y plugins ---
import { src, dest, watch, series } from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import fileInclude from 'gulp-file-include';
import terser from 'gulp-terser';
import plumber from 'gulp-plumber'; // para que no se rompa el watch en errores

const sassCompiler = gulpSass(sass);

// ============================
//  JS
// ============================
export function js() {
  return src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(terser())
    .pipe(dest('build/js'));
}

// ============================
//  LENGUAJES / JSON
// ============================
export function languages() {
  return src('src/languages/*.json')
    .pipe(plumber())
    .pipe(dest('build/languages'));
}

// ============================
//  SVG
// ============================
export function svg() {
  return src('src/img/*.svg')
    .pipe(plumber())
    .pipe(dest('build/img'));
}

// ============================
//  SCSS → CSS
// ============================
export function css() {
  return src('src/scss/app.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(
      sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError)
    )
    .pipe(dest('build/css', { sourcemaps: '.' }));
}

// ============================
//  HTML con file-include
// ============================
export function html() {
  return src('src/*.html')
    .pipe(plumber())
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(dest('build'));
}

// ============================
//  Archivos estáticos (robots, sitemap…)
// ============================
export function staticFiles() {
  return src(['src/robots.txt', 'src/sitemap.xml'])
    .pipe(plumber())
    .pipe(dest('build'));
}

// ============================
//  Recorte de imágenes (thumbnails)
//  - Ahora soporta JPG y PNG
// ============================
export function crop() {
  const inputFolder = 'src/img/gallery/full';
  const outputFolder = 'src/img/gallery/thumb';

  const width = 250;
  const height = 180;

  if (!fs.existsSync(inputFolder)) {
    return Promise.resolve();
  }

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const images = fs
    .readdirSync(inputFolder)
    .filter((file) => /\.(jpg|jpeg|png)$/i.test(path.extname(file)));

  const tasks = images.map((file) => {
    const inputFile = path.join(inputFolder, file);
    const outputFile = path.join(outputFolder, file);

    // Mantén el mismo formato del archivo de salida
    const ext = path.extname(file).toLowerCase();

    const pipeline = sharp(inputFile).resize(width, height, { position: 'centre' });

    if (ext === '.png') {
      return pipeline.png({ compressionLevel: 9 }).toFile(outputFile);
    }

    return pipeline.jpeg({ quality: 80 }).toFile(outputFile);
  });

  return Promise.all(tasks);
}

// ============================
//  Procesar imágenes → original optimizado + webp + avif
//  - PNG mantiene transparencia (alpha) en webp/avif
// ============================
function procesarImagenes(file, outputSubDir) {
  if (!fs.existsSync(outputSubDir)) {
    fs.mkdirSync(outputSubDir, { recursive: true });
  }

  const baseName = path.basename(file, path.extname(file));
  const extName = path.extname(file).toLowerCase();

  const outputOriginal = path.join(outputSubDir, `${baseName}${extName}`);
  const outputWebp = path.join(outputSubDir, `${baseName}.webp`);
  const outputAvif = path.join(outputSubDir, `${baseName}.avif`);

  return sharp(file)
    .metadata()
    .then((meta) => {
      console.log(`Processing: ${file} | hasAlpha: ${meta.hasAlpha}`);

      const tasks = [];

      // PNG: conservar transparencia + generar webp/avif con alpha
      if (extName === '.png') {
        tasks.push(
          sharp(file)
            .png({ compressionLevel: 9 })
            .toFile(outputOriginal)
        );

        tasks.push(
          sharp(file)
            .ensureAlpha()
            .webp(meta.hasAlpha ? { lossless: true } : { quality: 80 })
            .toFile(outputWebp)
        );

        tasks.push(
          sharp(file)
            .ensureAlpha()
            .avif({ quality: 50 })
            .toFile(outputAvif)
        );

        return Promise.all(tasks);
      }

      // JPG/JPEG: optimizar + webp + avif
      if (extName === '.jpg' || extName === '.jpeg') {
        tasks.push(
          sharp(file)
            .jpeg({ quality: 80 })
            .toFile(outputOriginal)
        );

        tasks.push(
          sharp(file)
            .webp({ quality: 80 })
            .toFile(outputWebp)
        );

        tasks.push(
          sharp(file)
            .avif({ quality: 45 })
            .toFile(outputAvif)
        );

        return Promise.all(tasks);
      }

      // Otros formatos: no hacer nada
      return Promise.resolve();
    });
}

export async function imagenes() {
  const srcDir = './src/img';
  const buildDir = './build/img';

  const images = await glob('./src/img/**/*.{jpg,jpeg,png}');

  if (!images.length) {
    return;
  }

  const tasks = images.map((file) => {
    const relativePath = path.relative(srcDir, path.dirname(file));
    const outputSubDir = path.join(buildDir, relativePath);
    return procesarImagenes(file, outputSubDir);
  });

  return Promise.all(tasks);
}

// ============================
//  DEV: watch
// ============================
export function dev() {
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', js);
  watch('src/img/**/*.{png,jpg,jpeg}', imagenes);
  watch('src/img/*.svg', svg);
  watch('src/languages/*.json', languages);
  watch('src/**/*.html', html);
  watch('src/*.{txt,xml,json,ico}', staticFiles);
}

// ============================
//  Tarea por defecto
// ============================
export default series(
  crop,        // genera thumbnails
  js,
  css,
  svg,
  languages,
  imagenes,    // procesa imágenes al inicio
  html,
  staticFiles,
  dev          // se queda escuchando cambios
);