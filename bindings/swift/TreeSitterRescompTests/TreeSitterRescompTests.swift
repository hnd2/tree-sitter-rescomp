import XCTest
import SwiftTreeSitter
import TreeSitterRescomp

final class TreeSitterRescompTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_rescomp())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Rescomp grammar")
    }
}
