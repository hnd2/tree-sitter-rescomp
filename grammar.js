/**
 * @file Rescomp grammar for tree-sitter
 * @author hnd
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rescomp",
  extras: ($) => [$.comment, /\s/],
  rules: {
    source_file: ($) => repeat($._statement),
    comment: (_) => token(choice(seq("#", /[^\r\n]*/), seq("//", /[^\r\n]*/))),
    _statement: ($) =>
      choice(
        $.palette_expression,
        $.bitmap_expression,
        $.tileset_expression,
        $.tilemap_expression,
        $.map_expression,
        $.objects_expression,
        $.image_expression,
        $.sprite_expression,
        $.xgm_expression,
        $.xgm2_expression,
        $.wav_expression,
        $.bin_expression,
        $.align_expression,
        $.ungroup_expression,
        $.near_expression,
      ),
    identifier: (_) => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
    string_literal: (_) => seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
    integer_literal: (_) => token(choice(/[1-9][0-9_]*/, /0/)),
    integer_array_literal: ($) => seq("[", commaSep1($.integer_literal), "]"),
    integer_array2d_literal: ($) =>
      seq("[", repeat1($.integer_array_literal), "]"),
    sortby_expression: (_) => token(seq('"sortby:', /[^"\\]+/, '"')),
    sprite_time_expression: ($) =>
      choice(
        $.integer_literal,
        $.integer_array_literal,
        $.integer_array2d_literal,
      ),

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
    keyword_collision: ($) => token(choice("CIRCLE", "BOX", "NONE")),
    keyword_sprite_optimization_type: ($) =>
      token(choice("0", "1", "2", "3", "BALANCED", "SPRITE", "TILE", "NONE")),
    keyword_sprite_optimization_level: ($) =>
      token(choice("0", "1", "2", "3", "FAST", "MEDIUM", "SLOW", "MAX")),
    keyword_sprite_optimization_duplicate: ($) =>
      token(choice("FALSE", "TRUE")),
    keyword_xgm_timing: ($) =>
      token(choice("-1", "0", "1", "AUTO", "NTSC", "PAL")),
    keyword_wav_driver: ($) =>
      token(choice("DEFAULT", "PCM", "DPCM2", "PCM4", "XGM", "XGM2")),
    keyword_far: ($) => token(choice("FALSE", "TRUE")),

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
          $.string_literal, // tileset_id
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
          $.string_literal, // layer_id
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
          $.string_literal, // tileset_id
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
          $.string_literal, // layer_id
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
    objects_expression: ($) =>
      seq(
        "OBJECTS",
        $.identifier, // name
        $.string_literal, // tmx_file
        $.string_literal, // layer_id
        $.string_literal, // field_defs
        optional($.sortby_expression), // sortby
        optional(
          seq(
            $.string_literal, // decl_type
            optional($.string_literal), // type_filter
          ),
        ),
      ),

    // IMAGE
    image_expression: ($) =>
      seq(
        "IMAGE",
        $.identifier, // name
        $.string_literal, // img_file
        optional(
          seq(
            $.keyword_compression, // compression
            optional(
              seq(
                $.keyword_optimization, // map_opt
                optional($.integer_literal), // map_base
              ),
            ),
          ),
        ),
      ),

    // SPRITE
    sprite_expression: ($) =>
      seq(
        "SPRITE",
        $.identifier, // name
        $.string_literal, // img_file
        $.integer_literal, // width
        $.integer_literal, // height
        optional(
          seq(
            $.keyword_compression, // compression
            optional(
              seq(
                $.sprite_time_expression, // time
                optional(
                  seq(
                    $.keyword_collision, // collision
                    optional(
                      seq(
                        $.keyword_sprite_optimization_type, // opt_type
                        optional(
                          seq(
                            $.keyword_sprite_optimization_level, // opt_level
                            optional($.keyword_sprite_optimization_duplicate), // opt_duplicate
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),

    // XGM
    xgm_expression: ($) =>
      seq(
        "XGM",
        $.identifier, // name
        $.string_literal, // file
        optional(
          seq(
            $.keyword_xgm_timing, // timing
            optional($.string_literal), // options
          ),
        ),
      ),

    // XGM2
    xgm2_expression: ($) =>
      seq(
        "XGM2",
        $.identifier, // name
        repeat1($.string_literal), // file(s)
        // optional($.string_literal), // options
      ),

    // WAV
    wav_expression: ($) =>
      seq(
        "WAV",
        $.identifier, // name
        $.string_literal, // wav_file
        $.keyword_wav_driver, // driver
        optional(
          seq(
            $.integer_literal, // out_rate
            optional($.keyword_far), // far
          ),
        ),
      ),

    // BIN
    bin_expression: ($) =>
      seq(
        "BIN",
        $.identifier, // name
        $.string_literal, // file
        optional(
          seq(
            $.integer_literal, // align
            optional(
              seq(
                $.integer_literal, // size_align
                optional(
                  seq(
                    $.integer_literal, // fill
                    optional(
                      seq(
                        $.keyword_compression, // compression
                        optional($.keyword_far), // far
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),

    // ALIGN
    align_expression: ($) =>
      seq(
        "ALIGN",
        optional($.integer_literal), // value
      ),

    // UNGROUP
    ungroup_expression: ($) => "UNGROUP",

    // NEAR
    near_expression: ($) => "NEAR",
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
