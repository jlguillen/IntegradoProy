'use strict';

var Fs = require('fs'),
    Mustache = require('mustache'),
    Phantom = require('phantom'),
    Utils = require('jxutils');

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
                Phantom.create(function (ph) {

                    ph.createPage(function (page) {

                      page.set('paperSize', {
                          border: '1cm',
                           format: 'A4',
                           orientation: 'portrait',
                           footer: {
                              height: '1cm',
                              contents: ph.callback(function(pageNum, numPages) {
                                  return '<p style="text-align: center" >' + pageNum + ' / ' + numPages + '</p>';
                              })
                          }

                      });
                      page.set('loadImages', true);

                        page.open(tmpFileName, function(status) {
                            page.render(options.output, function() {
                                Fs.unlink(tmpFileName);
                                ph.exit();
                                callback.call(this, arguments);
                            });
                        });

                    });
                }, {
                  dnodeOpts: {weak: false}
                  }
              );
            });

            return self;
        };
    };
