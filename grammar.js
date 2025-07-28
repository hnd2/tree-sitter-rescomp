/**
 * @file Rescomp grammar for tree-sitter
 * @author hnd
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rescomp",
  extras: ($) => [$.comment, /[ \t]/],
  conflicts: ($) => [[$.tilemap_statement], [$.map_statement]],
  rules: {
    source_file: ($) => repeat($._statement),
    comment: (_) => token(choice(seq("#", /[^\r\n]*/), seq("//", /[^\r\n]*/))),
    _newline: (_) => /\r?\n/,

    _statement: ($) =>
      choice(
        $._newline,
        $.comment,
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
    string_literal: (_) =>
      token(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"')),
    integer_literal: (_) => token(choice(/[1-9][0-9_]*/, /0/)),
    integer_array_literal: ($) => seq("[", commaSep1($.integer_literal), "]"),
    integer_array2d_literal: ($) =>
      seq("[", repeat1($.integer_array_literal), "]"),
    sprite_size_literal: ($) =>
      seq($.integer_literal, optional(choice("p", "P", "f", "F"))),
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
        field("name", $.identifier),
        field("file", $.string_literal),
        $._newline,
      ),

    // BITMAP
    bitmap_statement: ($) =>
      seq(
        $.keyword_bitmap,
        field("name", $.identifier),
        field("img_file", $.string_literal),
        field("compression", optional($.keyword_compression)),
        $._newline,
      ),

    // TILESET
    tileset_statement: ($) =>
      seq(
        $.keyword_tileset,
        field("name", $.identifier),
        field("file", $.string_literal), // file
        optional(
          seq(
            field("compression", $.keyword_compression),
            optional(
              seq(
                field("opt", $.keyword_optimization),
                optional(
                  seq(
                    field("ordering", $.keyword_ordering),
                    optional(field("export", $.keyword_export)),
                  ),
                ),
              ),
            ),
          ),
        ),
        $._newline,
      ),

    // TILEMAP
    tilemap_statement: ($) =>
      seq(
        $.keyword_tilemap,
        choice(
          seq(
            field("name", $.identifier),
            field("img_file", $.string_literal),
            field("tileset_id", $.string_literal),
            optional(
              seq(
                field("compression", $.keyword_compression),
                optional(
                  seq(
                    field("map_opt", $.keyword_optimization),
                    optional(
                      seq(
                        field("map_base", $.integer_literal),
                        optional(field("ordering", $.keyword_ordering)),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          seq(
            field("name", $.identifier),
            field("tmx_file", $.string_literal),
            field("layer_id", $.string_literal),
            optional(
              seq(
                field("ts_compression", $.keyword_compression),
                optional(
                  seq(
                    field("map_compression", $.keyword_compression),
                    optional(field("map_base", $.integer_literal)),
                  ),
                ),
              ),
            ),
          ),
        ),
        $._newline,
      ),

    // MAP
    map_statement: ($) =>
      seq(
        $.keyword_map,
        choice(
          seq(
            field("name", $.identifier),
            field("img_file", $.string_literal),
            field("tileset_id", $.string_literal),
            optional(
              seq(
                field("compression", $.keyword_compression),
                optional(field("map_base", $.integer_literal)),
              ),
            ),
          ),
          seq(
            field("name", $.identifier),
            field("tmx_file", $.string_literal),
            field("layer_id", $.string_literal),
            optional(
              seq(
                field("ts_compression", $.keyword_compression),
                optional(
                  seq(
                    field("map_compression", $.keyword_compression),
                    optional(
                      seq(
                        field("map_base", $.integer_literal),
                        optional(field("ordering", $.keyword_ordering)),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        $._newline,
      ),

    // OBJECTS
    objects_statement: ($) =>
      seq(
        $.keyword_objects,
        field("name", $.identifier),
        field("tmx_file", $.string_literal),
        field("layer_id", $.string_literal),
        field("field_defs", $.string_literal),
        optional(field("sortby", $.sortby_expression)),
        optional(
          seq(
            field("decl_type", $.string_literal),
            optional(field("type_filter", $.string_literal)),
          ),
        ),
        $._newline,
      ),

    // IMAGE
    image_statement: ($) =>
      seq(
        $.keyword_image,
        field("name", $.identifier),
        field("img_file", $.string_literal),
        optional(
          seq(
            field("compression", $.keyword_compression),
            optional(
              seq(
                field("map_opt", $.keyword_optimization),
                optional(field("map_base", $.integer_literal)),
              ),
            ),
          ),
        ),
        $._newline,
      ),

    // SPRITE
    sprite_statement: ($) =>
      seq(
        $.keyword_sprite,
        field("name", $.identifier),
        field("img_file", $.string_literal),
        field("width", $.sprite_size_literal),
        field("height", $.sprite_size_literal),
        optional(
          seq(
            field("compression", $.keyword_compression),
            optional(
              seq(
                field("time", $.sprite_time_expression),
                optional(
                  seq(
                    field("collision", $.keyword_collision),
                    optional(
                      seq(
                        field("opt_type", $.keyword_sprite_optimization_type),
                        optional(
                          seq(
                            field(
                              "opt_level",
                              $.keyword_sprite_optimization_level,
                            ),
                            optional(
                              field(
                                "opt_duplicate",
                                $.keyword_sprite_optimization_duplicate,
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
        ),
        $._newline,
      ),

    // XGM
    xgm_statement: ($) =>
      seq(
        $.keyword_xgm,
        field("name", $.identifier),
        field("file", $.string_literal),
        optional(
          seq(
            field("timing", $.keyword_xgm_timing),
            optional(field("options", $.string_literal)),
          ),
        ),
        $._newline,
      ),

    // XGM2
    xgm2_statement: ($) =>
      seq(
        $.keyword_xgm2,
        field("name", $.identifier),
        repeat1(field("file", $.string_literal)),
        // optional(field("options", $.string_literal)),
        $._newline,
      ),

    // WAV
    wav_statement: ($) =>
      seq(
        $.keyword_wav,
        field("name", $.identifier),
        field("wav_file", $.string_literal),
        field("driver", $.keyword_wav_driver),
        optional(
          seq(
            field("out_rate", $.integer_literal),
            optional(field("far", $.keyword_far)),
          ),
        ),
        $._newline,
      ),

    // BIN
    bin_statement: ($) =>
      seq(
        $.keyword_bin,
        field("name", $.identifier),
        field("file", $.string_literal),
        optional(
          seq(
            field("align", $.integer_literal),
            optional(
              seq(
                field("size_align", $.integer_literal),
                optional(
                  seq(
                    field("fill", $.integer_literal),
                    optional(
                      seq(
                        field("compression", $.keyword_compression),
                        optional(field("far", $.keyword_far)),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        $._newline,
      ),

    // ALIGN
    align_statement: ($) =>
      seq(
        $.keyword_align,
        optional(field("value", $.integer_literal)),
        $._newline,
      ),

    // UNGROUP
    ungroup_statement: ($) => seq($.keyword_ungroup, $._newline),

    // NEAR
    near_statement: ($) => seq($.keyword_near, $._newline),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
