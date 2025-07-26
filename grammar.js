/**
 * @file Rescomp grammar for tree-sitter
 * @author hnd
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rescomp",
  rules: {
    source_file: ($) => repeat($._statement),
    _statement: ($) =>
      choice(
        $.palette_expression,
        $.bitmap_expression,
        $.tileset_expression,
        $.tilemap_expression,
        $.map_expression,
      ),
    identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    string_literal: (_) => seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
    integer_literal: (_) => token(choice(/[1-9][0-9_]*/, /0/)),
    comment: (_) => token(choice(seq("#", /[^\r\n]*/), seq("//", /[^\r\n]*/))),

    // keyword
    keyword_compression: ($) =>
      token(
        choice(
          "-1",
          "0",
          "1",
          "2",
          "AUTO",
          "BEST",
          "NONE",
          "APLIB",
          "FAST",
          "LZ4W",
        ),
      ),
    keyword_optimization: ($) =>
      token(choice("0", "1", "2", "NONE", "ALL", "DUPLICATE")),
    keyword_ordering: ($) => token(choice("ROW", "COLUMN")),
    keyword_export: ($) => token(choice("0", "1", "FALSE", "TRUE")),

    // PALETTE
    palette_expression: ($) =>
      seq(
        "PALETTE",
        $.identifier, // name
        $.string_literal, // file
      ),

    // BITMAP
    bitmap_expression: ($) =>
      seq(
        "BITMAP",
        $.identifier, // name
        $.string_literal, // img_file
        optional($.keyword_compression), // compression
      ),

    // TILESET
    tileset_expression: ($) =>
      seq(
        "TILESET",
        $.identifier, // name
        $.string_literal, // file
        optional(
          seq(
            $.keyword_compression, // compression
            optional(
              seq(
                $.keyword_optimization, // opt
                optional(
                  seq(
                    $.keyword_ordering, // ordering
                    optional($.keyword_export), // export
                  ),
                ),
              ),
            ),
          ),
        ),
      ),

    // TILEMAP
    tilemap_expression: ($) =>
      choice(
        seq(
          "TILEMAP",
          $.identifier, // name
          $.string_literal, // img_file
          $.identifier, // tileset_id
          optional(
            seq(
              $.keyword_compression, // compression
              optional(
                seq(
                  $.keyword_optimization, // map_opt
                  optional(
                    seq(
                      $.integer_literal, //map_base
                      optional($.keyword_ordering), //ordering
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        seq(
          "TILEMAP",
          $.identifier, // name
          $.string_literal, // tmx_file
          $.identifier, // layer_id
          optional(
            seq(
              $.keyword_compression, // ts_compression
              optional(
                seq(
                  $.keyword_compression, // map_compression
                  optional($.integer_literal), // map_base
                ),
              ),
            ),
          ),
        ),
      ),

    // MAP
    map_expression: ($) =>
      choice(
        seq(
          "MAP",
          $.identifier, // name
          $.string_literal, // img_file
          $.identifier, // tileset_id
          optional(
            seq(
              $.keyword_compression, // compression
              optional($.integer_literal), // map_base
            ),
          ),
        ),
        seq(
          "MAP",
          $.identifier, // name
          $.string_literal, // tmx_file
          $.identifier, // layer_id
          optional(
            seq(
              $.keyword_compression, // ts_compression
              optional(
                seq(
                  $.keyword_compression, // map_compression
                  optional(
                    seq(
                      $.integer_literal, // map_base
                      optional($.keyword_ordering), // ordering
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),

    // OBJECTS
    objects_expression: ($) => seq("OBJECTS"),
  },
});
