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
        $.palette_statement,
        $.bitmap_statement,
        $.tileset_statement,
        $.tilemap_statement,
        $.map_statement,
        $.objects_statement,
        $.image_statement,
        $.sprite_statement,
        $.xgm_statement,
        $.xgm2_statement,
        $.wav_statement,
        $.bin_statement,
        $.align_statement,
        $.ungroup_statement,
        $.near_statement,
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
    keyword_palette: () => token("PALETTE"),
    keyword_bitmap: () => token("BITMAP"),
    keyword_tileset: () => token("TILESET"),
    keyword_tilemap: () => token("TILEMAP"),
    keyword_map: () => token("MAP"),
    keyword_objects: () => token("OBJECTS"),
    keyword_image: () => token("IMAGE"),
    keyword_sprite: () => token("SPRITE"),
    keyword_xgm: () => token("XGM"),
    keyword_xgm2: () => token("XGM2"),
    keyword_wav: () => token("WAV"),
    keyword_bin: () => token("BIN"),
    keyword_align: () => token("ALIGN"),
    keyword_ungroup: () => token("UNGROUP"),
    keyword_near: () => token("NEAR"),
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
    keyword_far: ($) => token(choice("FALSE", "TRUE")),
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

    // PALETTE
    palette_statement: ($) =>
      seq(
        $.keyword_palette,
        $.identifier, // name
        $.string_literal, // file
      ),

    // BITMAP
    bitmap_statement: ($) =>
      seq(
        $.keyword_bitmap,
        $.identifier, // name
        $.string_literal, // img_file
        optional($.keyword_compression), // compression
      ),

    // TILESET
    tileset_statement: ($) =>
      seq(
        $.keyword_tileset,
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
    tilemap_statement: ($) =>
      choice(
        seq(
          $.keyword_tilemap,
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
          $.keyword_tilemap,
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
    map_statement: ($) =>
      choice(
        seq(
          $.keyword_map,
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
          $.keyword_map,
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
    objects_statement: ($) =>
      seq(
        $.keyword_objects,
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
    image_statement: ($) =>
      seq(
        $.keyword_image,
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
    sprite_statement: ($) =>
      seq(
        $.keyword_sprite,
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
    xgm_statement: ($) =>
      seq(
        $.keyword_xgm,
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
    xgm2_statement: ($) =>
      seq(
        $.keyword_xgm2,
        $.identifier, // name
        repeat1($.string_literal), // file(s)
        // optional($.string_literal), // options
      ),

    // WAV
    wav_statement: ($) =>
      seq(
        $.keyword_wav,
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
    bin_statement: ($) =>
      seq(
        $.keyword_bin,
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
    align_statement: ($) =>
      seq(
        $.keyword_align,
        optional($.integer_literal), // value
      ),

    // UNGROUP
    ungroup_statement: ($) => $.keyword_ungroup,

    // NEAR
    near_statement: ($) => $.keyword_near,
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
