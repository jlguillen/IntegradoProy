'use strict';

var Fs = require('fs'),
    Mustache = require('mustache'),
    Utils = require('jxutils'),
    htmlToPdf = require('html-to-pdf');

    module.exports = function PDF (options) {

        var self = this;

        self.renderAsHtml = function (ops, callback) {

            // Some checks
            ops = Object(ops);
            callback = callback || function () {};

            var template = ops.template || options.config.template,
                // tipo = options.config.tipo,
                path = ops.path || options.config.path,
                rutinaData = {
                  datos: options.datos
                };

            Fs.readFile(template, function (err, templateContent) {

                templateContent = templateContent.toString();

                var rutinaHTML = Mustache.render(templateContent, rutinaData);

                if (typeof ops.output === 'string') {
                    Fs.writeFile(ops.output, rutinaHTML, function (err, data) {
                        callback(err, rutinaHTML);
                    });
                    return;
                }

                callback(null, rutinaHTML);

            });

            return self;

        };

        self.renderAsPdf = function (options, callback) {

            options = Object(options);
            callback = callback || function () {};

            var tmpFileName =
                __dirname + '/tmp-invoice-' + Math.random().toString(36) + '.html';

            self.renderAsHtml({

                output: tmpFileName
                // ,
                // tipo: options.tipo

            }, function (err) {

                if (err) { return callback(err); }

                var pdf = require('html-pdf');
                var html = Fs.readFileSync(tmpFileName, 'utf8');
                var options = { filename: './public/resources/temp/rutina.pdf', format: 'Letter' };

                pdf.create(html, options).toFile(function(err, res) {
                  if (err) return console.log(err);
                  Fs.unlink(tmpFileName);
                  callback.call(this, arguments);
                });

            });

            return self;
        };
    };
