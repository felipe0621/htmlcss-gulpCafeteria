const { src, dest, watch, series, parallel } = require('gulp'); //importando modulo gulp

//CSS Y SASS
const sass = require('gulp-sass')(require('sass'));//importando modulo gulp-sass y  sass
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

/*  creando una tarea

function tarea(done) {
    console.log('Desde mi prime tarea.....')

    done();
}

exports.tarea = tarea;*/




function css(done) {
    //compilar sass
    // pasos: 1- identificar archivo, 2-compilarla, 3-guardar el .css

    src('src/scss/app.scss') //identificando archivo
        //.pipe( sass({ outputStyle: 'compressed' }) )   //compilando
        .pipe( sourcemaps.init()) //para que inicialice el sourcemap
        .pipe( sass())
        .pipe( postcss([autoprefixer(), cssnano()]))
        .pipe( sourcemaps.write('.')) //esee punto para que se guarde junto al build
        .pipe( dest('build/css'))         //guardando

    done();

}
function imagenes( ) {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3}))
        .pipe( dest('build/img'))
    
}
function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')     //deben ser imagenes jpg o png
        .pipe( webp(opciones))
        .pipe(dest('build/img'))
}
function versionAvif(){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones))
        .pipe(dest('build/img'))
}

/*creo un watch para todas las tareas repetitivas*/ 
function dev(){
    //watch( 'src/scss/header/_header.scss', css);
    watch( 'src/scss/**/*.scss', css); //comodin para que tome todos los archivos con ext. .scss
    //watch('src/scss/app.scss', css);
    watch( 'src/img/***/*', imagenes);

}
/*
function tareaDefault() {
    console.log('Soy la tarea por default');
}*/

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
//exports.default = tareaDefault;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev);
//exports.default = parallel( css, dev);


// series - se inicia una tarea, y hasta qeu finaliza inicia la siguiente
// parallel - todas inicial al mismo tiempo  